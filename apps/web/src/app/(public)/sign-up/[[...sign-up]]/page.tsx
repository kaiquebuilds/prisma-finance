"use client";

import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  FieldDescription,
  Field,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSignUp } from "@clerk/nextjs";
import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded && !signUp) return null;

    try {
      await signUp.create({
        emailAddress: email,
      });

      await signUp.prepareEmailAddressVerification();
      await signUp.preparePhoneNumberVerification();

      setVerifying(true);
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  }

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded && !signUp) return null;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
              console.log(session?.currentTask);
              return;
            }

            await router.push("/");
          },
        });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(signUpAttempt);
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  }

  if (verifying) {
    return (
      <>
        <h1>Verify your email</h1>
        <form onSubmit={handleVerification}>
          <label htmlFor="code">Enter your verification code</label>
          <input
            value={code}
            id="code"
            name="code"
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">Verify</button>
        </form>
      </>
    );
  }

  return (
    <div className="bg-[url('/bg-pattern.svg')] bg-no-repeat bg-top flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full container-padding-desktop">
        <div className="flex flex-col gap-8">
          <form>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
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
                <h1 className="text-display-2xl p-sm font-bold font-display">
                  Bem-vindo(a) ao Prisma
                </h1>
                <FieldDescription>
                  Crie sua conta e comece a retomar o controle das suas
                  finanças.
                </FieldDescription>
              </div>
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@exemplo.com"
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Criar conta</Button>
              </Field>
              <FieldSeparator>Ou</FieldSeparator>
              <Field>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Entrar com Google
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <FieldDescription className="px-6 text-center">
            Já possui uma conta? <a href="/sign-in">Entre em sua conta</a>
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
