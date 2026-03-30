import { Select, type SelectSingleProps } from "@/components/shared/select";
import { useFieldContext } from "@/lib/hooks/useAppForm";
import { formatFormErrors } from "@/lib/formatFormErrors";

type FormSelectProps<TValue> = Omit<
  SelectSingleProps<TValue>,
  "multiple" | "value" | "onChange" | "onBlur" | "errorMessages"
>;

export function FormSelect<TValue = string>(props: FormSelectProps<TValue>) {
  const field = useFieldContext<TValue | null>();
  const showError = !field.state.meta.isValid;
  const errorMessages = showError
    ? formatFormErrors(field.state.meta.errors)
    : undefined;

  return (
    <Select<TValue>
      {...props}
      value={field.state.value}
      errorMessages={errorMessages}
      onChange={(value) => field.handleChange(value)}
      onBlur={() => field.handleBlur()}
    />
  );
}