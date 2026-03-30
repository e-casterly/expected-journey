import { ComponentPropsWithoutRef, useId } from "react";
import cx from "classnames";
import { Label } from "@/components/shared/Label";
import { ErrorList } from "@/components/shared/ErrorList";

type CheckboxProps = {
  label?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  errorMessages?: string[];
} & ComponentPropsWithoutRef<"input">;

export function Checkbox({
  label,
  name,
  className,
  labelClassName,
  wrapperClassName,
  errorMessages,
  ...props
}: CheckboxProps) {
  const inputId = useId();
  const errorId = useId();
  const showError = Boolean(errorMessages?.length);

  return (
    <div className={cx("w-full", wrapperClassName)}>
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          name={name}
          type="checkbox"
          className={cx(
            "h-4 w-4 rounded border bg-white text-primary transition focus:ring-2 focus:ring-zinc-900/10",
            { "border-stroke": !showError },
            { "border-destructive": showError },
            className
          )}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? errorId : undefined}
          {...props}
        />
        {label && (
          <Label
            htmlFor={inputId}
            className={cx("cursor-pointer select-none", labelClassName)}
          >
            {label}
          </Label>
        )}
      </div>
      <ErrorList messages={errorMessages} errorId={errorId} />
    </div>
  );
}
