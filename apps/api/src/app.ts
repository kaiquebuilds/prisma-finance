import express, { Response, Request, Express } from "express";
import { PrismaClient } from "./generated/prisma/client";
import { protectedRoute } from "./middleware/protectedRoute";
import { clerkClient, getAuth } from "@clerk/express";
import { findOrCreateUser } from "./services/user.service";
import logger from "./lib/logger";

export function createApp(): Express {
  const app = express();
  return app;
}

export function registerRoutes(app: Express, prisma: PrismaClient): void {
  const v1 = express.Router();

  v1.get("/users/me", async (req: Request, res: Response) => {
    const auth = getAuth(req);
    const prismaUserId = auth.sessionClaims?.prismaUserId as string | undefined;

    // Fast path: prismaUserId already in session claims
    if (prismaUserId) {
      const user = await prisma.user.findUnique({
        where: { id: prismaUserId },
      });

      if (user) {
        return res.json({ data: user });
      }
    }

    // JIT path: extract user data from JWT claims and create if needed
    const authProviderId = auth.userId;
    if (!authProviderId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const email = auth.sessionClaims?.email as string | undefined;
    const name = auth.sessionClaims?.name as string | undefined;

    if (!email || !name) {
      return res.status(400).json({
        message:
          "Missing required claims (email, name). Check your auth provider session token configuration.",
      });
    }

    try {
      const user = await findOrCreateUser(prisma, {
        authProviderId,
        email,
        name,
      });

      // Fire-and-forget: update Clerk externalId so future JWTs include prismaUserId
      clerkClient.users
        .updateUser(authProviderId, { externalId: user.id })
        .catch((err) => {
          logger.error("Failed to update auth provider externalId", {
            authProviderId,
            userId: user.id,
            error: err,
          });
        });

      return res.json({ data: user });
    } catch (error) {
      logger.error("JIT user creation failed", { authProviderId, error });
      return res
        .status(500)
        .json({ message: "Failed to provision user account" });
    }
  });

  app.use("/v1", protectedRoute, v1);
}

export function foo() {
  return "bar";
}
