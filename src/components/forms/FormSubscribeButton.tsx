import { Button } from "@/components/shared/Button";
import { useFormContext } from "@/lib/hooks/useAppForm";

type SubmitButtonProps = {
  label: string;
  fullWidth?: boolean;
};

export function FormSubscribeButton({ label, fullWidth = false }: SubmitButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          type="submit"
          disabled={!canSubmit}
          fullWidth={fullWidth}
          isLoading={isSubmitting}
        >
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
