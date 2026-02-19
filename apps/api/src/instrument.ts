import { env } from "@/env";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  enableLogs: true,
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
  enabled: env.API_ENV !== "development",
  environment: env.API_ENV ?? process.env.NODE_ENV,
});
