import { sayHello } from "@prisma-finance/core";
import express, { Response, Request, Express } from "express";
import { PrismaClient } from "./generated/prisma/client";
import { protectedRoute } from "./middleware/protectedRoute";
import { getAuth } from "@clerk/express";

export function createApp(): Express {
  const app = express();
  return app;
}

export function registerRoutes(app: Express, prisma: PrismaClient): void {
  const v1 = express.Router();

  v1.get("/", async (req: Request, res: Response) => {
    const message = `${sayHello()} (from server)`;

    const user = await prisma.user.findFirst({
      where: {
        name: {
          contains: "Alex",
        },
      },
    });

    if (!user) {
      return res.json({
        message,
      });
    }

    res.json({
      message: `${message}. Welcome, ${user.name}.`,
    });
  });

  v1.get("/users/me", async (req: Request, res: Response) => {
    const id = getAuth(req).sessionClaims.prismaUserId as string;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ data: user });
  });

  app.use("/v1", protectedRoute, v1);
}

export function foo() {
  return "bar";
}
