import classNames from "classnames";
import { ReactNode } from "react";

type DropdownListProps = {
  children: ReactNode;
  className?: string;
};

export function DropdownList({ children, className }: DropdownListProps) {
  return (
    <div role="none" className={classNames("max-h-64 overflow-auto py-1", className)}>
      {children}
    </div>
  );
}
