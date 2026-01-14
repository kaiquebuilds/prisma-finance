import { sayHello } from "@prisma-finance/core";
import express, { Application, Response } from "express";
import { prisma } from "./lib/prisma";

const app: Application = express();

export function foo() {
  return "bar";
}

const v1 = express.Router();

v1.get("/health", (_, res: Response) => {
  res.json({ message: "Healthy" });
});

v1.get("/", async (_, res: Response) => {
  const user = await prisma.user.findFirst({
    where: {
      name: {
        contains: "Alex",
      },
    },
  });

  res.json({
    message: sayHello() + `, ${user.name} (from server)`,
  });
});

app.use("/v1", v1);

export { app };
