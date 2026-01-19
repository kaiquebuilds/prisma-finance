import { sayHello } from "@prisma-finance/core";
import express, { Application, Response, Request } from "express";
import { prisma } from "./lib/prisma";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";
import { env } from "./env";

const app: Application = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);

app.use(express.json());

export function foo() {
  return "bar";
}

const v1 = express.Router();

app.get("/health", (_, res: Response) => {
  res.json({ message: "Healthy" });
});

v1.get("/", async (req: Request, res: Response) => {
  const message = `${sayHello()} (from server)`;

  console.log(req.headers);

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

app.use(errorHandler);

app.use("/v1", v1);

export { app };
