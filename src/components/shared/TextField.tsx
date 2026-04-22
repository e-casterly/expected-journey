import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
  useId,
} from "react";
import cx from "classnames";
import { Label } from "@/components/shared/Label";
import classNames from "classnames";
import { ErrorList } from "@/components/shared/ErrorList";
import { IconButton } from "@/components/shared/IconButton";

export type TextInputProps = {
  label?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  errorMessages?: string[];
  afterInput?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
  containerRef?: Ref<HTMLDivElement>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onSearch?: () => void;
} & ComponentPropsWithoutRef<"input">;

export function TextField({
  label,
  name,
  onChange,
  onBlur,
  onClear,
  onSearch,
  className,
  labelClassName,
  wrapperClassName,
  errorMessages,
  afterInput,
  inputRef,
  containerRef,
  value,
  ...props
}: TextInputProps) {
  const inputId = useId();
  const errorId = useId();
  const showError = Boolean(errorMessages?.length);
  const hasValue = String(value ?? "").trim().length > 0;
  const showClear = hasValue && Boolean(onClear);

  const paddingClassName = showClear ? "pr-10" : undefined;

  return (
    <div className={classNames("w-full", wrapperClassName)}>
      {label && (
        <Label
          htmlFor={inputId}
          className={cx("inline-flex pb-0.5", labelClassName)}
        >
          {label}
        </Label>
      )}
      <div className="relative" ref={containerRef}>
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          value={value}
          className={cx(
            "text-foreground focus:ring-contrast bg-field placeholder:text-placeholder focus:border-contrast h-10 w-full rounded-sm border px-4 py-2 text-base transition focus:ring-1 focus:outline-none",
            { "border-stroke": !showError },
            { "border-destructive": showError },
            paddingClassName,
            className
          )}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? errorId : undefined}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
        {showClear && (
          <div className="text-icon-field absolute inset-y-0 right-0 flex items-center gap-0.5 pr-2">
            {showClear && (
              <IconButton
                onClick={onClear}
                onMouseDown={(e) => e.preventDefault()}
                label="Clear"
                icon="Close"
                size="l"
              />
            )}
          </div>
        )}
        {afterInput}
      </div>
      <ErrorList messages={errorMessages} errorId={errorId} />
    </div>
  );
}
