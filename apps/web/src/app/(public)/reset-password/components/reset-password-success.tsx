"use client";

import { Button } from "@/components/ui/button";
import { FeaturedIcon } from "@/components/ui/featured-icon";
import CheckCircle from "@/icons/check-circle.svg";
import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { AuthPageHeader } from "../../_components/auth-page-header";

interface ResetPasswordSuccessProps {
  createdSessionId: string;
}

export function ResetPasswordSuccess({
  createdSessionId,
}: ResetPasswordSuccessProps) {
  const { setActive } = useSignIn();
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleSignIn() {
    if (!setActive) return;

    setIsRedirecting(true);
    await setActive({
      session: createdSessionId,
      redirectUrl: "/",
    });
  }

  return (
    <div className="flex flex-col gap-8 max-w-100 m-auto items-center">
      <AuthPageHeader
        title="Senha redefinida"
        subtitle={
          <>Sua senha foi redefinida com sucesso. Você já pode entrar.</>
        }
        icon={
          <FeaturedIcon>
            <CheckCircle />
          </FeaturedIcon>
        }
      />
      <Button
        onClick={handleSignIn}
        disabled={isRedirecting}
        className="w-full max-w-90"
      >
        Entrar na sua conta
      </Button>
    </div>
  );
}
