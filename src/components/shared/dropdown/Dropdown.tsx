"use client";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { DropdownProvider } from "@/components/shared/dropdown/DropdownContext";
import { DropdownContent } from "@/components/shared/dropdown/DropdownContent";
import { DropdownTrigger } from "@/components/shared/dropdown/DropdownTrigger";
import { DropdownItem } from "@/components/shared/dropdown/DropdownItem";
import { DropdownList } from "@/components/shared/dropdown/DropdownList";
import { DropdownEmpty } from "@/components/shared/dropdown/DropdownEmpty";
import { DropdownMenuItem } from "@/components/shared/dropdown/DropdownMenuItem";
import { ReactNode, useState } from "react";

type ControlledDropdownProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type UncontrolledDropdownProps = {
  open?: undefined;
  onOpenChange?: undefined;
  defaultOpen?: boolean;
};

type DropdownProps = (ControlledDropdownProps | UncontrolledDropdownProps) & {
  children: ReactNode;
  role?: "listbox" | "menu" | "dialog";
  matchTriggerWidth?: boolean;
  clickToToggle?: boolean;
};

function DropdownRoot({
  children,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  role: roleProp = "listbox",
  matchTriggerWidth = false,
  clickToToggle = false,
  ...rest
}: DropdownProps) {
  const defaultOpen = "defaultOpen" in rest ? rest.defaultOpen : false;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const onOpenChange = isControlled ? onOpenChangeProp : setUncontrolledOpen;
  const { context, floatingStyles, refs } = useFloating({
    open,
    onOpenChange,
    placement: "bottom-start",
    middleware: [
      offset(6),
      flip(),
      shift({ padding: 8 }),
      ...(matchTriggerWidth
        ? [
            size({
              apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                  width: `${rects.reference.width}px`,
                });
              },
            }),
          ]
        : []),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context, { enabled: clickToToggle });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: roleProp });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <DropdownProvider
      value={{
        open,
        onOpenChange,
        setReference: refs.setReference,
        setFloating: refs.setFloating,
        floatingStyles,
        getReferenceProps,
        getFloatingProps,
      }}
    >
      {children}
    </DropdownProvider>
  );
}

export const Dropdown = Object.assign(DropdownRoot, {
  Content: DropdownContent,
  Trigger: DropdownTrigger,
  Option: DropdownItem,
  List: DropdownList,
  Empty: DropdownEmpty,
  MenuItem: DropdownMenuItem,
});
