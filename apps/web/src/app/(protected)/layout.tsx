import { UserNotFound } from "@/components/user-not-found";
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
    return <UserNotFound statusCode={res.status} />;
  }

  const { data } = await res.json();

  if (!data) {
    return <UserNotFound statusCode={404} />;
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
