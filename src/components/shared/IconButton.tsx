import {
  Button,
  ButtonBaseProps,
  ButtonSize,
} from "@/components/shared/Button";
import { Icon, IconType } from "@/components/shared/Icon";
import type { ComponentPropsWithoutRef } from "react";
import cx from "classnames";

type IconButtonProps =
  Omit<ButtonBaseProps, "children" | "isIcon"> &
  Omit<ComponentPropsWithoutRef<"button">, "children"> & {
    icon: IconType;
    label: string;
  };

export function IconButton({ icon, label, size = "s", variant = "ghost", ...props }: IconButtonProps) {
  const sizeClassNames: Record<ButtonSize, string> = {
    s: "h-4 w-4",
    m: "h-5 w-5",
    l: "h-8 w-8",
  };
  return (
    <Button isIcon aria-label={label} size={size} variant={variant} {...props}>
      <Icon icon={icon} className={cx(sizeClassNames[size])} />
    </Button>
  );
}
