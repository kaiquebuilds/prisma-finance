import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
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
      return;
    }
  }

  console.error("Unhandled Clerk error:", JSON.stringify(error, null, 2));
}
