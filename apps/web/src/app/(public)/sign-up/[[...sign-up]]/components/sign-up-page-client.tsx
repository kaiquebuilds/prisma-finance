"use client";

import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import { LegalForm } from "./legal-form";
import { SignUpForm } from "./sign-up-form";
import { VerifyEmailForm } from "./verify-email-form";

function Loading() {
  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
      Loading...
    </div>
  );
}

type Step = "form" | "verify-email";

export function SignUpPageClient() {
  const [step, setStep] = useState<Step>("form");
  const { isLoaded, signUp } = useSignUp();

  if (!isLoaded || !signUp) return <Loading />;

  if (
    signUp.status === "missing_requirements" &&
    signUp.missingFields.includes("legal_accepted")
  ) {
    return <LegalForm />;
  }

  if (step === "form") {
    return <SignUpForm onSignUp={() => setStep("verify-email")} />;
  }

  return <VerifyEmailForm onBackClick={() => setStep("form")} />;
}
