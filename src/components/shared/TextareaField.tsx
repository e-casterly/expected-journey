import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  useId,
} from "react";
import classNames from "classnames";
import { Label } from "@/components/shared/Label";
import { ErrorList } from "@/components/shared/ErrorList";
import cx from "classnames";

export type TextareaSize = "s" | "m" | "l";

const sizeClassNames: Record<TextareaSize, string> = {
  s: "px-2 py-1 text-xs",
  m: "px-3 py-2 text-sm",
  l: "px-4 py-3 text-base",
};

export type TextareaFieldProps = {
  label?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  errorMessages?: string[];
  size?: TextareaSize;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
} & ComponentPropsWithoutRef<"textarea">;

export function TextareaField({
  label,
  labelClassName,
  wrapperClassName,
  errorMessages,
  size = "m",
  className,
  onChange,
  onBlur,
  ...props
}: TextareaFieldProps) {
  const inputId = useId();
  const errorId = useId();
  const showError = Boolean(errorMessages?.length);

  return (
    <div className={classNames("w-full flex flex-col", wrapperClassName)}>
      {label && (
        <Label htmlFor={inputId} className={cx("inline-flex pb-0.5", labelClassName)}>
          {label}
        </Label>
      )}
      <textarea
        id={inputId}
        className={classNames(
          "w-full rounded-md border bg-field placeholder:text-placeholder transition focus:border-contrast focus:ring-1 focus:ring-contrast focus:outline-none",
          sizeClassNames[size],
          showError ? "border-destructive" : "border-stroke",
          className
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