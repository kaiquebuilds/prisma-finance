import { ReactNode } from "react";

export default function SignUpLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="bg-[url('/bg-pattern.svg')] dark:bg-[url('/bg-pattern-dark.svg')] bg-no-repeat bg-position-[center_top] bg-size-[500px] sm:bg-size-[768px] sm:bg-position-[50%_-30%] flex min-h-svh flex-col items-center gap-6 p-4 md:p-8">
      <div className="w-full mt-24">{children}</div>
    </div>
  );
}
