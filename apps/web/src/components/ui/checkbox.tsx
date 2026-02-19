"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-border-primary data-[state=checked]:bg-bg-brand-solid data-[state=checked]:text-text-primary-on-brand data-[state=checked]:border-border-brand focus-visible:border-border-brand focus-visible:shadow-focus-border size-4 shrink-0 rounded-sm border shadow-xs transition-shadow outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-border-error aria-invalid:focus-visible:shadow-focus-border-error data-[state=checked]:aria-invalid:border-border-error",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-text-white"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
