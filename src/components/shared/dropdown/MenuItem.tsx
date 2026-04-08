"use client";

import classNames from "classnames";
import { Children, cloneElement, isValidElement, PointerEvent, ReactNode, Ref } from "react";

type MenuItemProps = {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  asChild?: boolean;
  onSelect?: () => void;
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

export function MenuItem({
  children,
  disabled = false,
  className,
  asChild = false,
  onSelect,
}: MenuItemProps) {
  const itemClassName = classNames(
    "flex w-full flex-col items-start px-3 py-2 text-left text-sm transition cursor-pointer",
    "text-zinc-800 hover:bg-zinc-50",
    { "cursor-default opacity-50": disabled },
    className,
  );

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      event.preventDefault();
    }
  }

  function handleClick() {
    if (!disabled) onSelect?.();
  }

  if (asChild) {
    const child = Children.only(children);

    if (!isValidElement(child)) {
      throw new Error("MenuItem with asChild expects a valid React element");
    }

    const childProps = child.props as {
      ref?: Ref<Element>;
      className?: string;
    } & Record<string, unknown>;

    const mergedRef = (node: Element | null) => {
      assignRef(childProps.ref, node);
    };

    return cloneElement(child, {
      ...childProps,
      ref: mergedRef,
      className: classNames(childProps.className, itemClassName),
      onPointerDown: handlePointerDown,
      onClick: handleClick,
      "aria-disabled": disabled || undefined,
    });
  }

  return (
    <div
      role="menuitem"
      aria-disabled={disabled || undefined}
      className={itemClassName}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
