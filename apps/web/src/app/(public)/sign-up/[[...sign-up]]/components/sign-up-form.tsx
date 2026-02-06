import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { handleClerkError } from "../lib/clerk-errors";
import { ERROR_MESSAGES } from "../lib/error-messages";
import { ClerkCaptcha } from "./clerk-captcha";
import { ContinueWithGoogleButton } from "./continue-with-google-button";
import { SignUpPageHeader } from "./sign-up-page-header";
import { TermsAndPrivacyCheckbox } from "./terms-and-privacy-checkbox";

const termsAndPrivacySchema = z.boolean().refine((value) => value, {
  error: ERROR_MESSAGES.LEGAL_ACCEPTANCE_REQUIRED,
});

const signUpFormSchema = z.object({
  firstName: z.string().min(1, { error: ERROR_MESSAGES.FIRST_NAME_REQUIRED }),
  lastName: z.string().min(1, { error: ERROR_MESSAGES.LAST_NAME_REQUIRED }),
  email: z.email({ error: ERROR_MESSAGES.INVALID_EMAIL }),
  termsAndPrivacy: termsAndPrivacySchema,
  password: z.string().min(8, { error: ERROR_MESSAGES.PASSWORD_LENGTH }),
});

type SignUpFormProps = {
  onSignUp: () => void;
};

export function SignUpForm({ onSignUp }: SignUpFormProps) {
  const { isLoaded, signUp } = useSignUp();

  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      termsAndPrivacy: false,
      password: "",
    },
    mode: "onTouched",
  });

  async function onSubmitSignUp(data: z.infer<typeof signUpFormSchema>) {
    if (!isLoaded || !signUp) return null;

    const { email, password, firstName, lastName } = data;

    try {
      await signUp.create({
        emailAddress: email,
        firstName,
        lastName,
        password,
        legalAccepted: true,
      });

      await signUp.prepareEmailAddressVerification();

      onSignUp();
    } catch (error) {
      handleClerkError(error, signUpForm.setError);
    }
  }

  async function signUpWithGoogle() {
    if (!isLoaded || !signUp) return null;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (error) {
      console.error("Error:", JSON.stringify(error, null, 2));
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-100 m-auto">
      <form onSubmit={signUpForm.handleSubmit(onSubmitSignUp)} noValidate>
        <FieldGroup className="flex flex-col gap-8">
          <SignUpPageHeader
            title="Bem-vindo(a) ao Prisma"
            subtitle={<>Crie sua conta e comece a gerenciar suas finanças.</>}
          />
          <div className="flex flex-col gap-5">
            {signUpForm.formState.errors.root && (
              <p className="text-sm text-center text-text-error-primary">
                {signUpForm.formState.errors.root.message}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-5">
              <Controller
                name="firstName"
                control={signUpForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Nome</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      aria-invalid={fieldState.invalid}
                      aria-describedby="first-name-error"
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
                control={signUpForm.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="last-name">Sobrenome</FieldLabel>
                    <Input
                      {...field}
                      id="last-name"
                      type="text"
                      placeholder="Seu sobrenome"
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
            </div>
            <Controller
              control={signUpForm.control}
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
              control={signUpForm.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Escolha uma senha"
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
              name="termsAndPrivacy"
              control={signUpForm.control}
              render={({ field, fieldState }) => (
                <TermsAndPrivacyCheckbox
                  field={field}
                  invalid={fieldState.invalid}
                  error={fieldState.error}
                />
              )}
            />

            <div className="flex flex-col gap-4 -mt-4">
              <ClerkCaptcha />
              <Field>
                <Button
                  disabled={signUpForm.formState.isSubmitting}
                  type="submit"
                >
                  Criar conta
                </Button>
              </Field>
              <Field>
                <ContinueWithGoogleButton onClick={signUpWithGoogle} />
              </Field>
            </div>
          </div>
        </FieldGroup>
      </form>
      <p className="text-center text-text-tertiaty text-sm">
        Já possui uma conta? <Link href="/sign-in">Entre em sua conta</Link>
      </p>
    </div>
  );
}
