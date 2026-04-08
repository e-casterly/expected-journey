import { cloneElement, isValidElement, type ReactNode, type CSSProperties } from "react";
import classNames from "classnames";

type SlotProps = Record<string, unknown> & {
  children?: ReactNode;
};

function composeEventHandlers(
  slotHandler: unknown,
  childHandler: unknown,
) {
  // Child handler runs first. If it calls event.preventDefault(),
  // the slot handler is skipped — the child retains full control over the event.
  return (event: unknown, ...args: unknown[]) => {
    (childHandler as Function)?.(event, ...args);
    if (!(event as Event)?.defaultPrevented) {
      (slotHandler as Function)?.(event, ...args);
    }
  };
}

export function Slot({ children, ...slotProps }: SlotProps) {
  const child = Array.isArray(children) ? children[0] : children;

  if (!isValidElement(child)) {
    throw new Error("Slot expects a single valid React element as a child");
  }

  const childProps = child.props as Record<string, unknown>;
  const mergedProps: Record<string, unknown> = { ...childProps };

  for (const key of Object.keys(slotProps)) {
    if (key === "className") {
      mergedProps.className = classNames(
        slotProps.className as string | undefined,
        childProps.className as string | undefined,
      );
    } else if (key === "style") {
      mergedProps.style = {
        ...(childProps.style as CSSProperties | undefined),
        ...(slotProps.style as CSSProperties | undefined),
      };
    } else if (key.startsWith("on") && typeof slotProps[key] === "function") {
      mergedProps[key] = composeEventHandlers(slotProps[key], childProps[key]);
    } else {
      mergedProps[key] = slotProps[key];
    }
  }

  return cloneElement(child, mergedProps as Record<string, unknown>);
}
