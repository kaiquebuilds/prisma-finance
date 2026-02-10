"use client";

import { useSignIn } from "@clerk/nextjs";
import { SignInForm } from "./components/sign-in-form";

function Loading() {
  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
      Loading...
    </div>
  );
}

export function SignInPageClient() {
  const { isLoaded } = useSignIn();

  if (!isLoaded) return <Loading />;

  return <SignInForm />;
}
