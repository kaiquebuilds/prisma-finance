import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FieldError as RHFFieldError } from "react-hook-form";

interface TermsAndPrivacyCheckboxProps {
  field: {
    name: string;
    value: boolean;
    onChange: (value: boolean) => void;
  };
  invalid: boolean;
  error: RHFFieldError | undefined;
}

export function TermsAndPrivacyCheckbox({
  field,
  invalid,
  error,
}: TermsAndPrivacyCheckboxProps) {
  return (
    <FieldGroup data-slot="checkbox-group" className="my-2">
      <Field
        orientation="horizontal"
        className="flex flex-row items-start gap-2"
        data-invalid={invalid}
      >
        <Checkbox
          id="terms-and-privacy"
          name={field.name}
          aria-invalid={invalid}
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
      {invalid && (
        <FieldError
          className="text-text-error-primary"
          errors={[error]}
        ></FieldError>
      )}
    </FieldGroup>
  );
}
