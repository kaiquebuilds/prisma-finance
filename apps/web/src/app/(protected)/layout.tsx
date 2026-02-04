import {
  RedirectToSignIn,
  RedirectToTasks,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function RootProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
