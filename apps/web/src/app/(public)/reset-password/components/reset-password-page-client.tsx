"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NewPasswordForm } from "./new-password-form";
import { ResetPasswordForm } from "./reset-password-form";
import { ResetPasswordSuccess } from "./reset-password-success";
import { VerifyResetCodeForm } from "./verify-reset-code-form";

type Step = "send-email" | "verify-code" | "new-password" | "success";

function getInitialStep(signInStatus: string | null): Step {
  if (signInStatus === "needs_new_password") return "new-password";
  return "send-email";
}

export function ResetPasswordPageClient() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const initialStep = getInitialStep(signIn?.status ?? null);
  const [step, setStep] = useState<Step>(initialStep);
  const [accountExists, setAccountExists] = useState(false);
  const [createdSessionId, setCreatedSessionId] = useState("");

  function handleBackToSignIn() {
    router.push("/sign-in");
  }

  switch (step) {
    case "send-email":
      return (
        <ResetPasswordForm
          onSubmit={(exists) => {
            setAccountExists(exists);
            setStep("verify-code");
          }}
          onBackClick={handleBackToSignIn}
        />
      );
    case "verify-code":
      return (
        <VerifyResetCodeForm
          accountExists={accountExists}
          onSubmit={() => setStep("new-password")}
          onBackClick={handleBackToSignIn}
        />
      );
    case "new-password":
      return (
        <NewPasswordForm
          resumedFromSignIn={initialStep === "new-password"}
          onSubmit={(sessionId) => {
            setCreatedSessionId(sessionId);
            setStep("success");
          }}
        />
      );
    case "success":
      return <ResetPasswordSuccess createdSessionId={createdSessionId} />;
  }
}
