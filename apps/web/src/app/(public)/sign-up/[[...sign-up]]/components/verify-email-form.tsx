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
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Mail } from "lucide-react";
import posthog from "posthog-js";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { handleClerkError } from "../../../_lib/clerk-errors";
import { ClerkCaptcha } from "../../../_components/clerk-captcha";
import { AuthPageHeader } from "../../../_components/auth-page-header";

const verifyCodeFormSchema = z.object({
  code: z.string().min(6),
});

interface VerifyEmailFormProps {
  onBackClick: () => void;
}

export function VerifyEmailForm({ onBackClick }: VerifyEmailFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const verifyCodeForm = useForm<z.infer<typeof verifyCodeFormSchema>>({
    resolver: zodResolver(verifyCodeFormSchema),
    defaultValues: {
      code: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  async function onSubmitVerificationForm({
    code,
  }: z.infer<typeof verifyCodeFormSchema>) {
    if (!isLoaded || !signUp) return null;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code,
      });
      if (signUpAttempt.status === "complete") {
        posthog.capture("sign_up_completed", {
          method: "email",
        });

        await setActive({
          session: signUpAttempt.createdSessionId,
          redirectUrl: "/",
        });
      } else {
        console.error(signUpAttempt);
      }
    } catch (error) {
      handleClerkError(error, verifyCodeForm.setError);
    }
  }

  async function resendVerificationCode() {
    if (!isLoaded || !signUp) return;

    verifyCodeForm.setValue("code", "");
    verifyCodeForm.clearErrors();
    verifyCodeForm.setFocus("code");

    try {
      await signUp.prepareEmailAddressVerification();

      posthog.capture("sign_up_verification_resent");
    } catch (error) {
      handleClerkError(error, verifyCodeForm.setError);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={verifyCodeForm.handleSubmit(onSubmitVerificationForm)}
        noValidate
      >
        <FieldGroup className="flex items-center flex-col gap-8">
          {verifyCodeForm.formState.errors.root && (
            <p className="text-sm text-center text-text-error-primary">
              {verifyCodeForm.formState.errors.root.message}
            </p>
          )}
          <div className="flex flex-col items-center gap-2 text-center">
            <AuthPageHeader
              title="Verifique seu email"
              subtitle={
                <>
                  Enviamos um link de verificação para{" "}
                  <span className="font-medium">{signUp?.emailAddress}</span>
                </>
              }
              icon={
                <FeaturedIcon>
                  <Mail />
                </FeaturedIcon>
              }
            />
          </div>
          <div className="flex flex-col items-center gap-5">
            <Controller
              control={verifyCodeForm.control}
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
                  verifyCodeForm.formState.isSubmitting ||
                  !verifyCodeForm.formState.isValid
                }
                type="submit"
              >
                Verificar email
              </Button>
            </Field>
          </div>
        </FieldGroup>
      </form>

      <p className="text-center text-text-tertiaty text-sm">
        Não recebeu o email?{" "}
        <IntervalButton
          waitAmountInSecods={30}
          onClick={resendVerificationCode}
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

      <Button onClick={onBackClick} className="text-sm" variant="link">
        <ArrowLeft />
        Alterar endereço de email
      </Button>
    </div>
  );
}
