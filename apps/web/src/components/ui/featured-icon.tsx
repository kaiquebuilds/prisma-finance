import { ReactNode } from "react";

export function FeaturedIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex bg-bg-primary size-14 p-3.5 shadow-xs rounded-xl border border-border-primary items-center justify-center mb-6">
      {children}
    </div>
  );
}
