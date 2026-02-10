"use client";

import { fetchApi } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MAX_RETRIES = 10;
const RETRY_INTERVAL_MS = 3000;

type Status = "loading" | "error";

interface UserNotFoundProps {
  statusCode: number;
}

export function UserNotFound({ statusCode }: UserNotFoundProps) {
  const router = useRouter();
  const shouldRetry = statusCode === 404;
  const [status, setStatus] = useState<Status>(
    shouldRetry ? "loading" : "error",
  );
  const retriesRef = useRef(0);
  const abortedRef = useRef(false);

  useEffect(() => {
    if (!shouldRetry) return;

    abortedRef.current = false;
    retriesRef.current = 0;

    async function pollUser() {
      try {
        const res = await fetchApi("/v1/users/me");
        const { data } = await res.json();

        if (abortedRef.current) return;

        if (data) {
          router.refresh();
          return;
        }
      } catch {
        // fetchApi throws on non-ok responses, continue retrying
      }

      if (abortedRef.current) return;

      retriesRef.current++;

      if (retriesRef.current >= MAX_RETRIES) {
        setStatus("error");
        return;
      }

      timerId = setTimeout(pollUser, RETRY_INTERVAL_MS);
    }

    let timerId = setTimeout(pollUser, RETRY_INTERVAL_MS);

    return () => {
      abortedRef.current = true;
      clearTimeout(timerId);
    };
  }, [shouldRetry, router]);

  if (status === "error") {
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

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-screen">
      <div className="size-8 animate-spin rounded-full border-4 border-border-primary border-t-transparent" />
      <p className="text-text-secondary text-sm">Preparando sua conta...</p>
    </div>
  );
}
