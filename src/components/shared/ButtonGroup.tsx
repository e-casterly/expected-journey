import { ReactNode } from "react";
import cx from "classnames";

type ButtonGroupProps = {
  children: ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
  "aria-label"?: string;
};

export function ButtonGroup({
  children,
  className,
  orientation = "horizontal",
  "aria-label": ariaLabel,
}: ButtonGroupProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cx(
        "flex w-fit items-stretch",
        isHorizontal ? "flex-row" : "flex-col",
        "*:rounded-none",
        isHorizontal ? "*:first:rounded-l-md" : "*:first:rounded-t-md",
        isHorizontal ? "*:last:rounded-r-md" : "*:last:rounded-b-md",
        isHorizontal ? "*:not-first:-ml-px" : "*:not-first:-mt-px",
        "*:not-first:hover:z-10",
        "*:focus-visible:z-10",
        className,
      )}
    >
      {children}
    </div>
  );
}