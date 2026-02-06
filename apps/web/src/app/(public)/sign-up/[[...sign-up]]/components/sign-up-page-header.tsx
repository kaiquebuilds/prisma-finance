import { ReactNode } from "react";
import { PrismaLogoMark } from "./prisma-logo";

export function SignUpPageHeader({
  title,
  subtitle,
  icon,
}: Readonly<{ title: string; subtitle: ReactNode; icon?: ReactNode }>) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {icon ? (
        icon
      ) : (
        <a href="https://prismafinance.app">
          <PrismaLogoMark />
        </a>
      )}

      <h1 className="text-display-xs font-semibold sm:text-display-sm font-display">
        {title}
      </h1>
      <p className="text-md text-text-tertiaty">{subtitle}</p>
    </div>
  );
}
