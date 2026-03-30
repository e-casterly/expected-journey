import {
  AutocompleteField,
  type AutocompleteFieldProps,
  type AutocompleteItem,
} from "@/components/shared/AutocompleteField";
import { useFieldContext } from "@/lib/hooks/useAppForm";
import { formatFormErrors } from "@/lib/formatFormErrors";

type FormAutocompleteFieldProps<TValue> = Omit<
  AutocompleteFieldProps<TValue>,
  "value" | "errorMessages"
>;

export function FormAutocompleteField<TValue = string>({
  onQueryChange,
  onSelect,
  onBlur,
  ...props
}: FormAutocompleteFieldProps<TValue>) {
  const field = useFieldContext<string>();
  const showError = !field.state.meta.isValid;
  const errorMessages = showError
    ? formatFormErrors(field.state.meta.errors)
    : undefined;

  return (
    <AutocompleteField<TValue>
      {...props}
      value={field.state.value}
      errorMessages={errorMessages}
      onQueryChange={(value) => {
        field.handleChange(value);
        onQueryChange(value);
      }}
      onSelect={(item: AutocompleteItem<TValue>) => {
        field.handleChange(item.label);
        onSelect(item);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        field.handleBlur();
      }}
    />
  );
}