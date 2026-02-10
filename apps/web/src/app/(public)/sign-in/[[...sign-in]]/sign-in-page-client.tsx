"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignInForm } from "./components/sign-in-form";

function Loading() {
  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
      Loading...
    </div>
  );
}

export function SignInPageClient() {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !signIn) return;

    if (signIn.status === "needs_new_password") {
      router.replace("/reset-password");
    }
  }, [isLoaded, signIn, router]);

  if (!isLoaded) return <Loading />;

  return <SignInForm />;
}
