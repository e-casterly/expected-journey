import {
  Children,
  cloneElement,
  isValidElement,
  type Ref,
  type ReactNode,
} from "react";
import classNames from "classnames";
import { useDropdownContext } from "@/components/shared/dropdown/DropdownContext";

type DropdownTriggerProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
};

function assignRef<TValue>(ref: Ref<TValue> | undefined, value: TValue) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref && typeof ref === "object") {
    ref.current = value;
  }
}

export function DropdownTrigger({
  children,
  asChild = false,
  className,
}: DropdownTriggerProps) {
  const { getReferenceProps, open, setReference } = useDropdownContext();

  if (asChild) {
    const child = Children.only(children);

    if (!isValidElement(child)) {
      throw new Error("DropdownTrigger with asChild expects a valid React element");
    }

    const childProps = child.props as {
      ref?: Ref<Element>;
      className?: string;
    } & Record<string, unknown>;
    const mergedRef = (node: Element | null) => {
      setReference(node);
      assignRef(childProps.ref, node);
    };

    return cloneElement(
      child,
      getReferenceProps({
        ...(childProps as Record<string, unknown>),
        "data-state": open ? "open" : "closed",
        className: classNames(childProps.className, className),
        ref: mergedRef,
      }),
    );
  }

  return (
    <div
      className={className}
      {...getReferenceProps({
        "data-state": open ? "open" : "closed",
        ref: setReference,
      })}
    >
      {children}
    </div>
  );
}
