import { useFieldContext } from "@/lib/hooks/useAppForm";
import { TextareaField, type TextareaFieldProps } from "@/components/shared/TextareaField";
import { formatFormErrors } from "@/lib/formatFormErrors";

type FormTextareaFieldProps = Omit<TextareaFieldProps, "value" | "onChange">;

export function FormTextareaField(props: FormTextareaFieldProps) {
  const field = useFieldContext<string>();
  const showError = !field.state.meta.isValid;
  const { onBlur, ...restProps } = props;

  return (
    <TextareaField
      {...restProps}
      value={field.state.value}
      errorMessages={showError ? formatFormErrors(field.state.meta.errors) : undefined}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={(e) => {
        onBlur?.(e);
        field.handleBlur();
      }}
    />
  );
}