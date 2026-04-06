import classNames from "classnames";
import { PointerEvent, ReactNode } from "react";

type MenuItemProps = {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  onSelect?: () => void;
};

export function MenuItem({
  children,
  disabled = false,
  className,
  onSelect,
}: MenuItemProps) {
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      event.preventDefault();
    }
  }

  return (
    <div
      role="menuitem"
      aria-disabled={disabled || undefined}
      className={classNames(
        "flex w-full flex-col items-start px-3 py-2 text-left text-sm transition cursor-pointer",
        "text-zinc-800 hover:bg-zinc-50",
        { "cursor-default opacity-50": disabled },
        className,
      )}
      onPointerDown={handlePointerDown}
      onClick={() => {
        if (!disabled) onSelect?.();
      }}
    >
      {children}
    </div>
  );
}
