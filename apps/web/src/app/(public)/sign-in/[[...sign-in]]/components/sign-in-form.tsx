import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import posthog from "posthog-js";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { AuthPageHeader } from "../../../_components/auth-page-header";
import { ClerkCaptcha } from "../../../_components/clerk-captcha";
import { ContinueWithGoogleButton } from "../../../_components/continue-with-google-button";
import { handleClerkError } from "../../../_lib/clerk-errors";
import { ERROR_MESSAGES } from "../../../_lib/error-messages";

const signInFormSchema = z.object({
  email: z.email({ error: ERROR_MESSAGES.INVALID_EMAIL }),
  password: z.string().min(1, { error: ERROR_MESSAGES.PASSWORD_REQUIRED }),
});

export function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();

  const signInForm = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  async function onSubmitSignIn(data: z.infer<typeof signInFormSchema>) {
    if (!isLoaded || !signIn) return;

    try {
      const signInAttempt = await signIn.create({
        strategy: "password",
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        posthog.capture("sign_in_completed", {
          method: "email",
        });

        await setActive({
          session: signInAttempt.createdSessionId,
          redirectUrl: "/",
        });
      }
    } catch (error) {
      handleClerkError(error, signInForm.setError, "sign_in");
    }
  }

  async function signInWithGoogle() {
    if (!isLoaded || !signIn) return;

    posthog.capture("sign_in_created", {
      method: "google",
    });

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: { flow: "sign_in", method: "google" },
      });
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-100 m-auto">
      <form onSubmit={signInForm.handleSubmit(onSubmitSignIn)} noValidate>
        <FieldGroup className="flex flex-col gap-8">
          <AuthPageHeader
            title="Bem-vindo(a) de volta"
            subtitle={<>Entre na sua conta para continuar.</>}
          />
          <div className="flex flex-col gap-5">
            {signInForm.formState.errors.root && (
              <p className="text-sm text-center text-text-error-primary">
                {signInForm.formState.errors.root.message}
              </p>
            )}
            <Controller
              control={signInForm.control}
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
            <Controller
              control={signInForm.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Link
                      href="/reset-password"
                      className="text-sm text-text-tertiaty hover:underline"
                      tabIndex={-1}
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Sua senha"
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
                  disabled={signInForm.formState.isSubmitting}
                  type="submit"
                >
                  Entrar
                </Button>
              </Field>
              <Field>
                <ContinueWithGoogleButton onClick={signInWithGoogle} />
              </Field>
            </div>
          </div>
        </FieldGroup>
      </form>
      <p className="text-center text-text-tertiaty text-sm">
        Não possui uma conta? <Link href="/sign-up">Crie sua conta</Link>
      </p>
    </div>
  );
}
