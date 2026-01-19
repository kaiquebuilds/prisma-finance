import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("Error encountered:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
}
