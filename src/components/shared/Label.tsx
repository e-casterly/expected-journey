import { ComponentPropsWithoutRef, ReactNode } from "react";
import cx from "classnames";

type LabelProps = {
  children: ReactNode;
  htmlFor: string;
  className?: string;
} & ComponentPropsWithoutRef<"label">;

export function Label({ children, className, htmlFor, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cx("text-sm font-medium text-zinc-900", className)}
      {...props}
    >
      {children}
    </label>
  );
}
