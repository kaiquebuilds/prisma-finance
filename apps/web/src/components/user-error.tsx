"use client";

import { useRouter } from "next/navigation";

export function UserError() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-screen">
      <p className="text-text-secondary text-sm">
        Não foi possível carregar sua conta. Por favor, tente novamente.
      </p>
      <button
        onClick={() => router.refresh()}
        className="text-sm font-semibold text-brand-primary hover:underline"
      >
        Tentar novamente
      </button>
    </div>
  );
}
