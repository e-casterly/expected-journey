"use client";

import classNames from "classnames";
import { PointerEvent, ReactNode } from "react";
import { Slot } from "@/components/primitives/Slot";

type DropdownMenuItemProps = {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  asChild?: boolean;
  onSelectAction?: () => void;
};

export function DropdownMenuItem({
  children,
  disabled = false,
  className,
  asChild = false,
  onSelectAction,
}: DropdownMenuItemProps) {
  const itemClassName = classNames(
    "block w-full px-3 py-2 text-left text-sm transition cursor-pointer",
    "text-zinc-800 hover:bg-zinc-50",
    { "cursor-default opacity-50": disabled },
    className
  );

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      event.preventDefault();
    }
  }

  function handleClick() {
    if (!disabled) onSelectAction?.();
  }

  if (asChild) {
    return (
      <Slot
        role="menuitem"
        aria-disabled={disabled || undefined}
        className={itemClassName}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        {children}
      </Slot>
    );
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
