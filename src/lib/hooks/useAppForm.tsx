// Form hook with all field and form components registered
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormAutocompleteField } from "@/components/forms/FormAutocompleteField";
import { FormMultiSelect } from "@/components/forms/FormMultiSelect";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormSubscribeButton } from "@/components/forms/FormSubscribeButton";
import { FormTextField } from "@/components/forms/FormTextField";
import { FormTextareaField } from "@/components/forms/FormTextareaField";
import { FormErrorMessage } from "@/components/forms/FormErrorMessage";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField: FormTextField,
    TextareaField: FormTextareaField,
    AutocompleteField: FormAutocompleteField,
    Select: FormSelect,
    MultiSelect: FormMultiSelect,
  },
  formComponents: {
    SubscribeButton: FormSubscribeButton,
    ErrorMessage: FormErrorMessage,
  },
  fieldContext,
  formContext,
});
