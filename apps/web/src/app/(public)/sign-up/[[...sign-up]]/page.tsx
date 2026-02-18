import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUpPageClient } from "./components/sign-up-page-client";

export default async function SignUpPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect("/");
  }

  return <SignUpPageClient />;
}
