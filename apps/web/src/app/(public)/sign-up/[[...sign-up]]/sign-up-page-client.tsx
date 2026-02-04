"use client";

import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FeaturedIcon } from "@/components/ui/featured-icon";
import Mail from "@/icons/mail-01.svg";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { IntervalButton } from "../../../../components/interval-button";

function SignUpPageHeader({
  title,
  subtitle,
  icon,
}: Readonly<{ title: string; subtitle: ReactNode; icon?: ReactNode }>) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {icon ? (
        icon
      ) : (
        <a href="https://prismafinance.app">
          <div className="flex size-6 items-center justify-center mb-6">
            <svg
              height="30"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.12675 0.00847546C9.31089 0.0206831 9.49212 0.0559694 9.66397 0.119598L9.87022 0.210003L10.0627 0.323951C10.1861 0.407404 10.2981 0.505257 10.3966 0.614942L10.5341 0.787276L10.5528 0.81647L17.7105 11.9344H17.7086C18.2967 12.8156 17.9645 13.998 16.9828 14.4704L10.2002 17.7278L10.1992 17.7288C9.82703 17.9071 9.41613 18 9.00005 18C8.58388 17.9999 8.17312 17.9072 7.80087 17.7288L7.79989 17.7278L1.01634 14.4695C0.783304 14.3569 0.577803 14.1976 0.41331 14.0033C0.248955 13.8092 0.128758 13.5839 0.061708 13.3423C-0.00531626 13.1005 -0.0177179 12.8471 0.0243872 12.6002C0.0649228 12.3632 0.155989 12.1367 0.290544 11.9344L7.44633 0.81647C7.45244 0.806971 7.4595 0.79658 7.46597 0.787276C7.63424 0.545447 7.8626 0.347231 8.12989 0.210003C8.36037 0.0917426 8.6145 0.0255358 8.87434 0.00847546C8.91571 0.0034996 8.95826 9.50073e-06 9.00103 0C9.0436 1.44338e-05 9.08557 0.00353655 9.12675 0.00847546ZM2.08096 12.8234L7.99435 15.6636V3.63503L2.08096 12.8234ZM10.0058 15.6636L15.9182 12.8234L10.0058 3.6388V15.6636Z"
                fill="#7A5AF8"
              />
            </svg>
          </div>
          <span className="sr-only">Prisma</span>
        </a>
      )}

      <h1 className="text-display-xs font-semibold sm:text-display-sm font-display">
        {title}
      </h1>
      <p className="text-md text-text-tertiaty">{subtitle}</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
      Loading...
    </div>
  );
}

function ClerkCaptcha() {
  return (
    <>
      {/* Clerk's CAPTCHA widget */}
      <div id="clerk-captcha" data-cl-language="pt-BR" />
    </>
  );
}

const ERROR_MESSAGES = {
  LEGAL_ACCEPTANCE_REQUIRED:
    "Para criar uma conta, você precisa ler e aceitar os Termos de Uso e a Política de Privacidade.",
  FIRST_NAME_REQUIRED: "Por favor, insira seu nome",
  LAST_NAME_REQUIRED: "Por favor, insira seu sobrenome",
  INVALID_EMAIL: "Endereço de email inválido",
  PASSWORD_LENGTH: "Sua senha deve ter 8 ou mais caracteres",
  LEAKED_PASSWORD:
    "Sua senha foi encontrada num vazamento de dados. Para sua segurança, por favor utilize outra senha.",
  TOO_MANY_REQUESTS:
    "Estamos recebendo muitas requisições. Por favor, tente novamente em alguns instantes.",
  EMAIL_BEING_USED:
    "Este email já está sendo usado. Por favor, tente com outro email.",
  INCORRECT_VERIFICATION_CODE: "Código incorreto. Por favor, tente novamente.",
};

const termsAndPrivacySchema = z.boolean().refine((value) => value, {
  error: ERROR_MESSAGES.LEGAL_ACCEPTANCE_REQUIRED,
});

const legalFormSchema = z.object({
  termsAndPrivacy: termsAndPrivacySchema,
});

const signUpFormSchema = z.object({
  firstName: z.string().min(1, { error: ERROR_MESSAGES.FIRST_NAME_REQUIRED }),
  lastName: z.string().min(1, { error: ERROR_MESSAGES.LAST_NAME_REQUIRED }),
  email: z.email({ error: ERROR_MESSAGES.INVALID_EMAIL }),
  termsAndPrivacy: termsAndPrivacySchema,
  password: z.string().min(8, { error: ERROR_MESSAGES.PASSWORD_LENGTH }),
});

const verifyCodeFormSchema = z.object({
  code: z.string().min(6),
});

export function SignUpPageClient() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);

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

  const verifyCodeForm = useForm<z.infer<typeof verifyCodeFormSchema>>({
    resolver: zodResolver(verifyCodeFormSchema),
    defaultValues: {
      code: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const legalForm = useForm<z.infer<typeof legalFormSchema>>({
    resolver: zodResolver(legalFormSchema),
    defaultValues: {
      termsAndPrivacy: false,
    },
  });

  async function onSubmitSignUp(data: z.infer<typeof signUpFormSchema>) {
    if (!isLoaded && !signUp) return null;

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

      setVerifying(true);
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        if (error.errors.some((x) => x.code === "form_password_pwned")) {
          signUpForm.setError("password", {
            message: ERROR_MESSAGES.LEAKED_PASSWORD,
          });
        } else if (error.errors.some((e) => e.code === "too_many_requests")) {
          signUpForm.setError("root", {
            message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
          });
        } else if (
          error.errors.some((x) => x.code === "form_identifier_exists")
        ) {
          signUpForm.setError("root", {
            message: ERROR_MESSAGES.EMAIL_BEING_USED,
          });
        } else {
          console.error("Error:", JSON.stringify(error, null, 2));
        }
      }
    }
  }

  async function signUpWithGoogle() {
    if (!isLoaded && !signUp) return null;

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

  async function onSubmitVerificationForm({
    code,
  }: z.infer<typeof verifyCodeFormSchema>) {
    if (!isLoaded && !signUp) return null;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          redirectUrl: "/",
        });
      } else {
        console.error(signUpAttempt);
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        if (error.errors.some((e) => e.code === "too_many_requests")) {
          verifyCodeForm.setError("root", {
            message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
          });
        } else if (error.errors.some((e) => e.code === "form_code_incorrect")) {
          verifyCodeForm.setError("code", {
            message: ERROR_MESSAGES.INCORRECT_VERIFICATION_CODE,
          });
        } else {
          console.error("Error:", JSON.stringify(error, null, 2));
        }
      }
    }
  }

  async function resendVerificationCode() {
    if (!isLoaded || !signUp) return null;

    verifyCodeForm.setValue("code", "");
    verifyCodeForm.clearErrors();
    verifyCodeForm.setFocus("code");

    const {
      email: emailAddress,
      password,
      firstName,
      lastName,
    } = signUpForm.getValues();

    try {
      await signUp.create({
        emailAddress,
        firstName,
        lastName,
        password,
        legalAccepted: true,
      });
      await signUp.prepareEmailAddressVerification();
    } catch (error) {
      console.error("Error:", JSON.stringify(error, null, 2));
    }
  }

  async function onSubmitLegalForm(data: z.infer<typeof legalFormSchema>) {
    if (!signUp || !isLoaded) return;

    try {
      const res = await signUp.update({
        legalAccepted: data.termsAndPrivacy,
      });

      if (res.status === "complete") {
        await setActive({
          session: res.createdSessionId,
          redirectUrl: "/",
        });
      }
    } catch (error) {
      console.error("Error:", JSON.stringify(error, null, 2));
    }
  }

  if (!isLoaded) return <Loading />;

  if (
    signUp.status === "missing_requirements" &&
    signUp.missingFields[0] === "legal_accepted"
  ) {
    return (
      <div className="flex flex-col gap-8 max-w-100 m-auto">
        <form onSubmit={legalForm.handleSubmit(onSubmitLegalForm)} noValidate>
          <FieldGroup className="flex flex-col gap-8">
            <SignUpPageHeader
              title="Bem-vindo(a) ao Prisma"
              subtitle={
                <>
                  Leia e aceite os Termos de Uso e a Política de Privacidade
                  para continuar.
                </>
              }
            />
            <div className="flex flex-col gap-5">
              {legalForm.formState.errors.root && (
                <p className="text-sm text-center text-text-error-primary">
                  {legalForm.formState.errors.root.message}
                </p>
              )}
              <Controller
                name="termsAndPrivacy"
                control={legalForm.control}
                render={({ field, fieldState }) => (
                  <FieldGroup data-slot="checkbox-group" className="my-2">
                    <Field
                      orientation="horizontal"
                      className="flex flex-row items-start gap-2"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id="terms-and-privacy"
                        name={field.name}
                        aria-invalid={fieldState.invalid}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel
                        htmlFor="terms-and-privacy"
                        className="-mt-0.5 text-sm flex flex-row flex-wrap font-normal"
                      >
                        Li e aceito os{" "}
                        <a
                          className="underline font-normal"
                          target="_blank"
                          href="https://prismafinance.app/terms"
                        >
                          Termos de Uso
                        </a>{" "}
                        e a{" "}
                        <a
                          className="underline font-normal"
                          target="_blank"
                          href="https://prismafinance.app/privacy"
                        >
                          Política de Privacidade
                        </a>
                      </FieldLabel>
                    </Field>
                    {fieldState.invalid && (
                      <FieldError
                        className="text-text-error-primary"
                        errors={[fieldState.error]}
                      ></FieldError>
                    )}
                  </FieldGroup>
                )}
              ></Controller>

              <div className="flex flex-col gap-4 -mt-4">
                <ClerkCaptcha />
                <Field>
                  <Button
                    disabled={legalForm.formState.isSubmitting}
                    type="submit"
                  >
                    Continuar
                  </Button>
                </Field>
              </div>
            </div>
          </FieldGroup>
        </form>
      </div>
    );
  }

  if (verifying) {
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
              <SignUpPageHeader
                title="Verifique seu email"
                subtitle={
                  <>
                    Enviamos um link de verificação para{" "}
                    <span className="font-medium">
                      {signUpForm.getValues("email")}
                    </span>
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
      </div>
    );
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
                <FieldGroup data-slot="checkbox-group" className="my-2">
                  <Field
                    orientation="horizontal"
                    className="flex flex-row items-start gap-2"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      id="terms-and-privacy"
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel
                      htmlFor="terms-and-privacy"
                      className="-mt-0.5 text-sm flex flex-row flex-wrap font-normal"
                    >
                      Li e aceito os{" "}
                      <a
                        className="underline font-normal"
                        target="_blank"
                        href="https://prismafinance.app/terms"
                      >
                        Termos de Uso
                      </a>{" "}
                      e a{" "}
                      <a
                        className="underline font-normal"
                        target="_blank"
                        href="https://prismafinance.app/privacy"
                      >
                        Política de Privacidade
                      </a>
                    </FieldLabel>
                  </Field>
                  {fieldState.invalid && (
                    <FieldError
                      className="text-text-error-primary"
                      errors={[fieldState.error]}
                    ></FieldError>
                  )}
                </FieldGroup>
              )}
            ></Controller>

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
                <Button
                  className="bg-bg-primary text-text-secondary gap-3 hover:bg-bg-primary-hover shadow-xs-skeumorphic-with-border"
                  type="button"
                  onClick={signUpWithGoogle}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_19850_357231)">
                      <path
                        d="M23.7663 12.2765C23.7663 11.4608 23.7001 10.6406 23.559 9.83813H12.2402V14.4591H18.722C18.453 15.9495 17.5888 17.2679 16.3233 18.1056V21.104H20.1903C22.4611 19.014 23.7663 15.9274 23.7663 12.2765Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008V24.0008Z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.50277 14.3002C5.00011 12.8099 5.00011 11.196 5.50277 9.70569V6.61475H1.51674C-0.185266 10.0055 -0.185266 14.0004 1.51674 17.3912L5.50277 14.3002V14.3002Z"
                        fill="#FBBC04"
                      />
                      <path
                        d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45065 6.86173 9.10947 4.74966 12.2401 4.74966V4.74966Z"
                        fill="#EA4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_19850_357231">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Continuar com Google
                </Button>
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
