import * as Sentry from "@sentry/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import posthog from "posthog-js";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ERROR_MESSAGES } from "./error-messages";

const CLERK_ERROR_MAP: Record<string, { field: string; message: string }> = {
  form_password_pwned: {
    field: "password",
    message: ERROR_MESSAGES.LEAKED_PASSWORD,
  },
  too_many_requests: {
    field: "root",
    message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
  },
  form_identifier_exists: {
    field: "root",
    message: ERROR_MESSAGES.EMAIL_BEING_USED,
  },
  form_code_incorrect: {
    field: "code",
    message: ERROR_MESSAGES.INCORRECT_VERIFICATION_CODE,
  },
};

export function handleClerkError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  if (!isClerkAPIResponseError(error)) return;

  for (const clerkError of error.errors) {
    const mapped = CLERK_ERROR_MAP[clerkError.code];
    if (mapped) {
      setError(mapped.field as Path<T> | "root" | `root.${string}`, {
        message: mapped.message,
      });

      posthog.capture("sign_up_error", {
        error_code: clerkError.code,
        error_field: mapped.field,
      });

      return;
    }
  }

  Sentry.captureException(error, {
    tags: { flow: "sign_up" },
  });

  posthog.capture("sign_up_error", {
    error_codes: error.errors.map((e) => e.code),
  });
}
