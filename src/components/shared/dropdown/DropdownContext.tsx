"use client";

import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";
import { createContext, useContext } from "react";

export type DropdownContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setReference: (node: Element | null) => void;
  setFloating: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  getReferenceProps: (
    userProps?: Record<string, unknown>,
  ) => Record<string, unknown>;
  getFloatingProps: (
    userProps?: Record<string, unknown> & ComponentPropsWithoutRef<"div">,
  ) => Record<string, unknown>;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

export function DropdownProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: DropdownContextValue;
}) {
  return (
    <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>
  );
}

export function useDropdownContext() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error("Dropdown components must be used within <Dropdown />");
  }

  return context;
}
