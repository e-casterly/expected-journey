"use client";

import classNames from "classnames";
import { PointerEvent, ReactNode } from "react";

type DropdownItemProps = {
  id?: string;
  children: ReactNode;
  highlighted?: boolean;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  onSelect?: () => void;
  onPointerEnter?: () => void;
};

export function DropdownItem({
  id,
  children,
  highlighted = false,
  selected = false,
  disabled = false,
  className,
  onSelect,
  onPointerEnter,
}: DropdownItemProps) {
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      event.preventDefault();
    }
  }

  return (
    <div
      id={id}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      className={classNames(
        "flex w-full flex-col items-start px-3 py-2 text-left text-sm transition cursor-pointer",
        highlighted
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-800 hover:bg-zinc-50",
        {
          "cursor-default opacity-50": disabled,
        },
        className,
      )}
      onPointerEnter={onPointerEnter}
      onPointerDown={handlePointerDown}
      onClick={() => {
        if (!disabled) onSelect?.();
      }}
    >
      {children}
    </div>
  );
}
