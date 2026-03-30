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
import { ReactNode } from "react";

type DropdownProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: "listbox" | "menu" | "dialog";
  matchTriggerWidth?: boolean;
  clickToToggle?: boolean;
};

export function Dropdown({
  children,
  open,
  onOpenChange,
  role: roleProp = "listbox",
  matchTriggerWidth = false,
  clickToToggle = false,
}: DropdownProps) {
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
