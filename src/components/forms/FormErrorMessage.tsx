import { useFormContext } from "@/lib/hooks/useAppForm";
import { ErrorList } from "@/components/shared/ErrorList";

export function FormErrorMessage() {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.errorMap?.onSubmit}>
      {(submitError) => {
        const message: string = submitError;
        return <ErrorList messages={message} />;
      }}
    </form.Subscribe>
  );
}