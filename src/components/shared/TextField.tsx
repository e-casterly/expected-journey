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
  value,
  ...props
}: TextInputProps) {
  const inputId = useId();
  const errorId = useId();
  const showError = Boolean(errorMessages?.length);
  const hasValue = String(value ?? "").trim().length > 0;
  const showClear = hasValue && Boolean(onClear);
  const showSearch = Boolean(onSearch);
  const buttonCount = (showClear ? 1 : 0) + (showSearch ? 1 : 0);
  const paddingClassName =
    buttonCount === 2 ? "pr-20" : buttonCount === 1 ? "pr-10" : undefined;

  return (
    <div className={classNames("w-full", wrapperClassName)}>
      {label && (
        <Label htmlFor={inputId} className={cx("mb-0.5", labelClassName)}>
          {label}
        </Label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          value={value}
          className={cx(
            "h-9 w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none",
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
        {buttonCount > 0 && (
          <div className="absolute inset-y-0 right-0 flex items-center gap-0.5 pr-1.5">
            {showSearch && (
              <IconButton onClick={onSearch} label="Search" icon="Search" />
            )}
            {showClear && (
              <IconButton onClick={onSearch} label="Clear" icon="Close" />
            )}
          </div>
        )}
        {afterInput}
      </div>
      <ErrorList messages={errorMessages} errorId={errorId} />
    </div>
  );
}
