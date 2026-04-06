import { Button, ButtonBaseProps } from "@/components/shared/Button";
import { Icon, IconType } from "@/components/shared/Icon";
import type { ComponentPropsWithoutRef } from "react";

type IconButtonProps =
  Omit<ButtonBaseProps, "children" | "isIcon"> &
  Omit<ComponentPropsWithoutRef<"button">, "children"> & {
    icon: IconType;
    label: string;
  };

export function IconButton({ icon, label, size = "s", variant = "ghost", ...props }: IconButtonProps) {
  return (
    <Button isIcon aria-label={label} size={size} variant={variant} {...props}>
      <Icon icon={icon} />
    </Button>
  );
}
