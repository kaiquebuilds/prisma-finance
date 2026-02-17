import { clerkMiddleware } from "@clerk/express";
import * as Sentry from "@sentry/node";
import cors from "cors";
import express, { Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createApp, registerRoutes } from "./app";
import { env } from "./env";
import "./instrument";
import logger from "./lib/logger";
import { prisma } from "./lib/prisma";
import { errorHandler } from "./middleware/errorHandler";
import { morganMiddleware } from "./middleware/morgan";
import { PrismaUserRepository } from "./repositories/prisma-user.repository";
import { createWebhookRouter } from "./routes/webhooks";

const port = env.PORT;
const app = createApp();
const userRepo = new PrismaUserRepository(prisma);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "We're receiving a lot of requests right now. Please try again in a few seconds.",
});

app.set("trust proxy", true);
app.use(limiter);
app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morganMiddleware);

app.get("/health", (_req, res: Response) => {
  res.json({ message: "OK" });
});

app.use(
  "/webhooks",
  express.raw({ type: "application/json" }),
  createWebhookRouter(userRepo),
);

app.use(
  clerkMiddleware({
    audience: env.CLERK_JWT_AUDIENCE,
  }),
);
app.use(express.json());

registerRoutes(app, userRepo);

Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

const server = app.listen(port, async () => {
  logger.info(`Server listening at port ${port}...`);
  await prisma
    .$connect()
    .then(() => {
      logger.info("Connected to the database successfully.");
    })
    .catch((err) => {
      logger.error("Failed to connect to the database:", err);
    });
});

server.on("error", (err) => {
  logger.error("Server error:", err);
});

async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
