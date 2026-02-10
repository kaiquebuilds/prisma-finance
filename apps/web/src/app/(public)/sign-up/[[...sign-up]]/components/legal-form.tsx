import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import posthog from "posthog-js";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { handleClerkError } from "../../../_lib/clerk-errors";
import { ERROR_MESSAGES } from "../../../_lib/error-messages";
import { ClerkCaptcha } from "../../../_components/clerk-captcha";
import { AuthPageHeader } from "../../../_components/auth-page-header";
import { TermsAndPrivacyCheckbox } from "./terms-and-privacy-checkbox";

const termsAndPrivacySchema = z.boolean().refine((value) => value, {
  error: ERROR_MESSAGES.LEGAL_ACCEPTANCE_REQUIRED,
});

const legalFormSchema = z.object({
  termsAndPrivacy: termsAndPrivacySchema,
});

export function LegalForm() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const legalForm = useForm<z.infer<typeof legalFormSchema>>({
    resolver: zodResolver(legalFormSchema),
    defaultValues: {
      termsAndPrivacy: false,
    },
  });

  async function onSubmitLegalForm(data: z.infer<typeof legalFormSchema>) {
    if (!signUp || !isLoaded) return;

    try {
      const res = await signUp.update({
        legalAccepted: data.termsAndPrivacy,
      });

      if (res.status === "complete") {
        posthog.capture("sign_up_legal_accepted");

        await setActive({
          session: res.createdSessionId,
          redirectUrl: "/",
        });
      }
    } catch (error) {
      handleClerkError(error, legalForm.setError);
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-100 m-auto">
      <form onSubmit={legalForm.handleSubmit(onSubmitLegalForm)} noValidate>
        <FieldGroup className="flex flex-col gap-8">
          <AuthPageHeader
            title="Bem-vindo(a) ao Prisma"
            subtitle={
              <>
                Leia e aceite os Termos de Uso e a Política de Privacidade para
                continuar.
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
