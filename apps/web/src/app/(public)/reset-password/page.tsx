import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ResetPasswordPageClient } from "./components/reset-password-page-client";

export default async function ResetPasswordPage() {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) {
    redirect("/");
  }

  return <ResetPasswordPageClient />;
}
