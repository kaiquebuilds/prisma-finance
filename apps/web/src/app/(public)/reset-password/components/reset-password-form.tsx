"use client";

import { Button } from "@/components/ui/button";
import { FeaturedIcon } from "@/components/ui/featured-icon";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ArrowLeft from "@/icons/arrow-left.svg";
import Key from "@/icons/key-01.svg";
import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AuthPageHeader } from "../../_components/auth-page-header";
import { ClerkCaptcha } from "../../_components/clerk-captcha";
import { handleClerkError } from "../../_lib/clerk-errors";
import { ERROR_MESSAGES } from "../../_lib/error-messages";

const resetPasswordSchema = z.object({
  email: z.email({ error: ERROR_MESSAGES.INVALID_EMAIL }),
});
type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onBackClick: () => void;
  onSubmit: (accountExists: boolean) => void;
}

export function ResetPasswordForm({
  onSubmit,
  onBackClick,
}: ResetPasswordFormProps) {
  const { isLoaded, signIn } = useSignIn();
  const resetPasswordForm = useForm<ResetPasswordSchemaType>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  async function submitHandler(data: ResetPasswordSchemaType) {
    if (!isLoaded || !signIn) return;

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });
      onSubmit(true);
    } catch (error) {
      if (
        isClerkAPIResponseError(error) &&
        error.errors.some((e) => e.code === "form_identifier_not_found")
      ) {
        onSubmit(false);
        return;
      }
      handleClerkError(error, resetPasswordForm.setError);
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-100 m-auto">
      <form onSubmit={resetPasswordForm.handleSubmit(submitHandler)} noValidate>
        <FieldGroup className="flex flex-col gap-8">
          <AuthPageHeader
            title="Esqueceu sua senha?"
            subtitle={<>Enviaremos instruções para redefinir sua senha.</>}
            icon={
              <FeaturedIcon>
                <Key />
              </FeaturedIcon>
            }
          />
          <div className="flex flex-col gap-5">
            <Controller
              control={resetPasswordForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="m@exemplo.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-text-error-primary"
                    ></FieldError>
                  )}
                </Field>
              )}
            />

            <div className="flex flex-col gap-4 -mt-4">
              <ClerkCaptcha />
              <Field>
                <Button
                  disabled={resetPasswordForm.formState.isSubmitting}
                  type="submit"
                >
                  Redefinir senha
                </Button>
              </Field>
            </div>
          </div>
        </FieldGroup>
      </form>
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
