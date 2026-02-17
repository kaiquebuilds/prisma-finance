import { UserError } from "@/components/user-error";
import { fetchApiFromServer } from "@/lib/api/server";
import {
  RedirectToSignIn,
  RedirectToTasks,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default async function RootProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await fetchApiFromServer("/v1/users/me");

  if (!res.ok) {
    return <UserError />;
  }

  const { data } = await res.json();

  if (!data) {
    return <UserError />;
  }

  return (
    <>
      <SignedIn>
        <UserButton />
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToTasks />
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
