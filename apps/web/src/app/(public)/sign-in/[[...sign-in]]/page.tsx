import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInPageClient } from "./sign-in-page-client";

export default async function SignInPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect("/");
  }

  return <SignInPageClient />;
}
