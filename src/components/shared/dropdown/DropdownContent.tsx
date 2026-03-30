import type { ComponentPropsWithoutRef, ReactNode } from "react";
import classNames from "classnames";
import { FloatingPortal } from "@floating-ui/react";
import { useDropdownContext } from "@/components/shared/dropdown/DropdownContext";

type DropdownContentProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "children" | "className">;

export function DropdownContent({
  children,
  className,
  ...props
}: DropdownContentProps) {
  const { style, ...restProps } = props;
  const { floatingStyles, getFloatingProps, open, setFloating } =
    useDropdownContext();

  if (!open) return null;

  return (
    <FloatingPortal>
      <div
        ref={setFloating}
        style={{ ...style, ...floatingStyles }}
        className={classNames(
          "z-20 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg",
          className,
        )}
        {...getFloatingProps(restProps)}
      >
        {children}
      </div>
    </FloatingPortal>
  );
}
