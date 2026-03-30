import classNames from "classnames";
import { ReactNode } from "react";

type DropdownEmptyProps = {
  children: ReactNode;
  className?: string;
};

export function DropdownEmpty({
  children,
  className,
}: DropdownEmptyProps) {
  return (
    <div role="status" className={classNames("px-3 py-2 text-sm text-zinc-600", className)}>
      {children}
    </div>
  );
}
