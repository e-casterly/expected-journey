import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  useId,
} from "react";
import classNames from "classnames";
import { Label } from "@/components/shared/Label";
import { ErrorList } from "@/components/shared/ErrorList";

export type TextareaFieldProps = {
  label?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  errorMessages?: string[];
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
} & ComponentPropsWithoutRef<"textarea">;

export function TextareaField({
  label,
  labelClassName,
  wrapperClassName,
  errorMessages,
  className,
  onChange,
  onBlur,
  ...props
}: TextareaFieldProps) {
  const inputId = useId();
  const errorId = useId();
  const showError = Boolean(errorMessages?.length);

  return (
    <div className={classNames("w-full", wrapperClassName)}>
      {label && (
        <Label htmlFor={inputId} className={labelClassName}>
          {label}
        </Label>
      )}
      <textarea
        id={inputId}
        className={classNames(
          "mt-0.5 w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none",
          showError ? "border-destructive" : "border-stroke",
          className,
        )}
        aria-invalid={showError || undefined}
        aria-describedby={showError ? errorId : undefined}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      <ErrorList messages={errorMessages} errorId={errorId} />
    </div>
  );
}