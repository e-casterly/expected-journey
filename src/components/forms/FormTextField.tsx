import { TextField, TextInputProps } from "@/components/shared/TextField";
import { useFieldContext } from "@/lib/hooks/useAppForm";
import { formatFormErrors } from "@/lib/formatFormErrors";

type TextFieldProps = Omit<TextInputProps, "value" | "onChange">;

export function FormTextField(props: TextFieldProps) {
  const field = useFieldContext<string>();
  const showError = !field.state.meta.isValid;

  const errorMessages = showError
    ? formatFormErrors(field.state.meta.errors)
    : undefined;
  const { onBlur, ...restProps } = props;
  return (
    <TextField
      {...restProps}
      value={field.state.value}
      errorMessages={errorMessages}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={(e) => {
        onBlur?.(e);
        field.handleBlur();
      }}
    />
  );
}
