import winston from "winston";
import Transport from "winston-transport";
import { Sentry } from "./sentry";
import { env } from "@/env";

const SentryTransport = Sentry.createSentryWinstonTransport(Transport);

const logger = winston.createLogger({
  transports: [new SentryTransport()],
});

if (env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
