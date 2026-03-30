import { useFieldContext } from "@/lib/hooks/useAppForm";
import { Select, type SelectMultipleProps } from "@/components/shared/select";

type FormMultiSelectProps<TValue = string> = Omit<
  SelectMultipleProps<TValue>,
  "multiple" | "value" | "onChange" | "onBlur" | "errorMessages"
>;

export function FormMultiSelect<TValue = string>(
  props: FormMultiSelectProps<TValue>,
) {
  const field = useFieldContext<TValue[]>();

  return (
    <Select<TValue>
      {...props}
      multiple
      value={field.state.value ?? []}
      errorMessages={
        !field.state.meta.isValid
          ? field.state.meta.errors.flatMap((e) => (e ? [String(e)] : []))
          : undefined
      }
      onChange={(value) => field.handleChange(value)}
      onBlur={() => field.handleBlur()}
    />
  );
}