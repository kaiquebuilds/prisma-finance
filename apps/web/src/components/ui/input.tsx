import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-text-placeholder border-border-primary w-full min-w-0 rounded-md border bg-transparent px-3.5 py-2.5 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-border-brand focus-visible:shadow-focus-border",
        "aria-invalid:border-border-error aria-invalid:focus-visible:shadow-focus-border-error",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
