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
import Key from "@/icons/key-01.svg";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import posthog from "posthog-js";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AuthPageHeader } from "../../_components/auth-page-header";
import { ClerkCaptcha } from "../../_components/clerk-captcha";
import { handleClerkError } from "../../_lib/clerk-errors";
import { ERROR_MESSAGES } from "../../_lib/error-messages";

const newPasswordSchema = z
  .object({
    password: z.string().min(8, { error: ERROR_MESSAGES.PASSWORD_LENGTH }),
    confirmPassword: z
      .string()
      .min(1, { error: ERROR_MESSAGES.PASSWORD_REQUIRED }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.PASSWORD_CONFIRMATION_MISMATCH,
    path: ["confirmPassword"],
  });

type NewPasswordSchemaType = z.infer<typeof newPasswordSchema>;

interface NewPasswordFormProps {
  onSubmit: (createdSessionId: string) => void;
}

export function NewPasswordForm({ onSubmit }: NewPasswordFormProps) {
  const { isLoaded, signIn } = useSignIn();

  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  async function submitHandler(data: NewPasswordSchemaType) {
    if (!isLoaded || !signIn) return;

    try {
      const result = await signIn.resetPassword({
        password: data.password,
        signOutOfOtherSessions: true,
      });

      if (result.status === "complete" && result.createdSessionId) {
        posthog.capture("reset_password_completed");
        onSubmit(result.createdSessionId);
      }
    } catch (error) {
      handleClerkError(error, form.setError, "reset_password");
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-100 m-auto">
      <form onSubmit={form.handleSubmit(submitHandler)} noValidate>
        <FieldGroup className="flex flex-col gap-8">
          <AuthPageHeader
            title="Escolha sua nova senha"
            subtitle={<>Sua nova senha deve ter pelo menos 8 caracteres.</>}
            icon={
              <FeaturedIcon>
                <Key />
              </FeaturedIcon>
            }
          />
          <div className="flex flex-col gap-5">
            {form.formState.errors.root && (
              <p className="text-sm text-center text-text-error-primary">
                {form.formState.errors.root.message}
              </p>
            )}
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Nova senha</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Sua nova senha"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-text-error-primary"
                    />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirmar senha
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua nova senha"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-text-error-primary"
                    />
                  )}
                </Field>
              )}
            />

            <div className="flex flex-col gap-4 -mt-4">
              <ClerkCaptcha />
              <Field>
                <Button disabled={form.formState.isSubmitting} type="submit">
                  Redefinir senha
                </Button>
              </Field>
            </div>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
