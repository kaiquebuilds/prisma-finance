"use client";

import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import ArrowLeft from "@/icons/arrow-left.svg";
import { Icon } from "@/components/ui/icon";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const signUpFormSchema = z.object({
  firstName: z.string().min(1, { error: "Por favor, insira seu nome" }),
  lastName: z.string().min(1, { error: "Por favor, insira seu sobrenome" }),
  email: z.email({ error: "Endereço de email inválido" }),
  termsAndPrivacy: z.boolean().refine((value) => value, {
    error:
      "Para criar uma conta, você precisa ler e aceitar os Termos de Uso e a Política de Privacidade.",
  }),
});

const verifyCodeFormSchema = z.object({
  code: z.string().min(6),
});

export default function SignUpPage() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(true);

  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      termsAndPrivacy: false,
    },
    mode: "onTouched",
  });

  const verifyCodeForm = useForm<z.infer<typeof verifyCodeFormSchema>>({
    resolver: zodResolver(verifyCodeFormSchema),
    defaultValues: {
      code: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(data: z.infer<typeof signUpFormSchema>) {
    console.debug(data);
    // if (!isLoaded && !signUp) return null;

    // const { email, firstName, lastName } = data;

    // try {
    //   await signUp.create({
    //     emailAddress: email,
    //     firstName,
    //     lastName,
    //   });

    //   await signUp.prepareEmailAddressVerification();

    //   setVerifying(true);
    // } catch (err) {
    //   console.error("Error:", JSON.stringify(err, null, 2));
    // }
  }

  async function handleVerification(
    data: z.infer<typeof verifyCodeFormSchema>,
  ) {
    console.log(data);
    // e.preventDefault();
    // if (!isLoaded && !signUp) return null;
    // try {
    //   const signUpAttempt = await signUp.attemptEmailAddressVerification({
    //     code,
    //   });
    //   if (signUpAttempt.status === "complete") {
    //     await setActive({
    //       session: signUpAttempt.createdSessionId,
    //       navigate: async ({ session }) => {
    //         if (session?.currentTask) {
    //           // Check for tasks and navigate to custom UI to help users resolve them
    //           // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
    //           console.log(session?.currentTask);
    //           return;
    //         }
    //         await router.push("/");
    //       },
    //     });
    //   } else {
    //     // If the status is not complete, check why. User may need to
    //     // complete further steps.
    //     console.error(signUpAttempt);
    //   }
    // } catch (err) {
    //   // See https://clerk.com/docs/guides/development/custom-flows/error-handling
    //   // for more info on error handling
    //   console.error("Error:", JSON.stringify(err, null, 2));
    // }
  }

  if (verifying) {
    return (
      <div className="flex flex-col gap-8">
        <form
          onSubmit={verifyCodeForm.handleSubmit(handleVerification)}
          noValidate
        >
          <FieldGroup className="flex items-center flex-col gap-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <FeaturedIcon>
                <Mail />
              </FeaturedIcon>
              <h1 className="text-display-xs font-semibold sm:text-display-sm font-display">
                Verifique seu email
              </h1>
              <p className="text-md text-text-tertiaty">
                Enviamos um link de verificação para{" "}
                <span className="font-medium">
                  {signUpForm.getValues("email")}
                </span>
              </p>
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
                  </Field>
                )}
              />
            </div>
            <div className="flex flex-col gap-4 w-full max-w-90 mt-1">
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
          <Link href="/sign-in">Clique aqui para reenviar</Link>
        </p>
        <div className="flex flex-row justify-center">
          <Button className="py-0" variant="link">
            <Icon as={ArrowLeft} />
            Voltar para o login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-100 m-auto">
      <form onSubmit={signUpForm.handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
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
            <h1 className="text-display-xs font-semibold sm:text-display-sm font-display">
              Bem-vindo(a) ao Prisma
            </h1>
            <p className="text-md text-text-tertiaty">
              Crie sua conta e comece a gerenciar suas finanças.
            </p>
          </div>
          <div className="flex flex-col gap-5">
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
              name="termsAndPrivacy"
              control={signUpForm.control}
              render={({ field, fieldState }) => (
                <FieldGroup data-slot="checkbox-group">
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
            <div className="flex flex-col gap-4 mt-1">
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
