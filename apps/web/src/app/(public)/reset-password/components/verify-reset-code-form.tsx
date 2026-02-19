"use client";

import { IntervalButton } from "@/components/interval-button";
import { Button } from "@/components/ui/button";
import { FeaturedIcon } from "@/components/ui/featured-icon";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import ArrowLeft from "@/icons/arrow-left.svg";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Mail } from "lucide-react";
import posthog from "posthog-js";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { AuthPageHeader } from "../../_components/auth-page-header";
import { ClerkCaptcha } from "../../_components/clerk-captcha";
import { handleClerkError } from "../../_lib/clerk-errors";
import { ERROR_MESSAGES } from "../../_lib/error-messages";

const verifyResetCodeSchema = z.object({
  code: z.string().min(6),
});

interface VerifyResetCodeFormProps {
  accountExists: boolean;
  onSubmit: () => void;
  onBackClick: () => void;
}

export function VerifyResetCodeForm({
  accountExists,
  onSubmit,
  onBackClick,
}: VerifyResetCodeFormProps) {
  const { isLoaded, signIn } = useSignIn();

  const form = useForm<z.infer<typeof verifyResetCodeSchema>>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: {
      code: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  async function submitHandler({
    code,
  }: z.infer<typeof verifyResetCodeSchema>) {
    if (!isLoaded || !signIn) return;

    if (!accountExists) {
      form.setError("code", {
        message: ERROR_MESSAGES.INCORRECT_VERIFICATION_CODE,
      });
      return;
    }

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
      });

      if (result.status === "needs_new_password") {
        posthog.capture("reset_password_code_verified");
        onSubmit();
      }
    } catch (error) {
      handleClerkError(error, form.setError, "reset_password");
    }
  }

  async function resendCode() {
    if (!isLoaded || !signIn || !accountExists) return;

    form.setValue("code", "");
    form.clearErrors();
    form.setFocus("code");

    try {
      const firstFactor = signIn.supportedFirstFactors?.find(
        (factor) => factor.strategy === "reset_password_email_code",
      );

      if (!firstFactor || !("emailAddressId" in firstFactor)) return;

      await signIn.prepareFirstFactor({
        strategy: "reset_password_email_code",
        emailAddressId: firstFactor.emailAddressId,
      });

      posthog.capture("reset_password_code_resent");
    } catch (error) {
      handleClerkError(error, form.setError, "reset_password");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={form.handleSubmit(submitHandler)} noValidate>
        <FieldGroup className="flex items-center flex-col gap-8">
          {form.formState.errors.root && (
            <p className="text-sm text-center text-text-error-primary">
              {form.formState.errors.root.message}
            </p>
          )}
          <AuthPageHeader
            title="Verifique seu email"
            subtitle={<>Insira o código de 6 dígitos enviado para seu email.</>}
            icon={
              <FeaturedIcon>
                <Mail />
              </FeaturedIcon>
            }
          />
          <div className="flex flex-col items-center gap-5">
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field>
                  <InputOTP
                    {...field}
                    maxLength={6}
                    placeholder="0"
                    aria-invalid={fieldState.invalid}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-center mt-4 text-text-error-primary"
                    />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex flex-col gap-4 w-full max-w-90 -mt-4">
            <ClerkCaptcha />
            <Field>
              <Button
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
                type="submit"
              >
                Verificar código
              </Button>
            </Field>
          </div>
        </FieldGroup>
      </form>

      <p className="text-center text-text-tertiaty text-sm">
        Não recebeu o email?{" "}
        <IntervalButton
          waitAmountInSecods={30}
          onClick={resendCode}
          render={(isIntervalActive, secondsRemaining) => {
            return (
              <>
                Clique aqui para reenviar{" "}
                {isIntervalActive && `(${secondsRemaining})`}
              </>
            );
          }}
        />
      </p>

      <Button
        onClick={onBackClick}
        className="text-sm font-semibold py-0"
        variant="link"
      >
        <ArrowLeft />
        Voltar para o login
      </Button>
    </div>
  );
}
