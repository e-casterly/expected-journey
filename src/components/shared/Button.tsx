import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import cx from "classnames";
import { Spinner } from "@/components/shared/Spinner";

type ButtonVariant = "contained" | "text" | "ghost";
type ButtonColor = "primary" | "secondary" | "destructive";
type ButtonSize = "s" | "m" | "l";

export type ButtonBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  isIcon?: boolean;
  size?: ButtonSize;
};

type ButtonAsButtonProps = ButtonBaseProps & {
  href?: never;
} & ComponentPropsWithoutRef<"button">;

type ButtonAsLinkProps = ButtonBaseProps &
  ComponentPropsWithoutRef<typeof Link>;

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button({
  fullWidth = false,
  variant = "contained",
  color = "primary",
  disabled = false,
  isLoading = false,
  isIcon = false,
  size = "m",
  ...props
}: ButtonProps) {
  const containedByColor: Record<ButtonColor, string> = {
    primary:
      "bg-primary not-disabled:hover:bg-primary/90 not-disabled:focus-visible:ring-primary text-white",
    secondary:
      "bg-secondary not-disabled:hover:bg-gray-100 not-disabled:focus-visible:ring-secondary shadow-md",
    destructive:
      "bg-destructive not-disabled:hover:bg-destructive/90 not-disabled:focus-visible:ring-destructive text-white",
  };

  const textByColor: Record<ButtonColor, string> = {
    primary:
      "text-primary not-disabled:hover:text-primary/80 not-disabled:focus-visible:ring-primary",
    secondary:
      "text-secondary not-disabled:hover:text-secondary/80 not-disabled:focus-visible:ring-secondary",
    destructive:
      "text-destructive not-disabled:hover:text-destructive/80 not-disabled:focus-visible:ring-destructive",
  };

  const variantClassNames: Record<ButtonVariant, string> = {
    contained:
      "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    text: "underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    ghost: "not-disabled:hover:bg-gray-100",
  };

  const sizeClassNames: Record<ButtonSize, string> = {
    s: "h-6 px-4 py-2",
    m: "h-9 px-4 py-2",
    l: "h-12 px-6 py-2",
  };

  const iconSizeClassNames: Record<ButtonSize, string> = {
    s: "h-6 w-6 p-1",
    m: "h-9 w-9 p-2",
    l: "h-12 w-12 p-3",
  };

  const commonClasses = cx(
    variantClassNames[variant],
    {
      "inline-flex items-center justify-center text-base font-medium":
        variant !== "ghost",
      [sizeClassNames[size]]: !isIcon,
      [iconSizeClassNames[size]]: isIcon,
      "rounded-md": isIcon,
      "w-full": fullWidth,
      [containedByColor[color]]: variant === "contained",
      [textByColor[color]]: variant === "text",
      "bg-disabled": variant === "contained" && disabled,
    },
    disabled ? "cursor-default" : "cursor-pointer"
  );

  if ("href" in props && props.href !== undefined) {
    const { href, children, className, ...rest } = props;
    return (
      <Link href={href} className={cx(commonClasses, className)} {...rest}>
        {children}
      </Link>
    );
  }

  const { type = "button", children, className, ...rest } = props;
  return (
    <button
      type={type}
      className={cx(commonClasses, className)}
      disabled={disabled}
      {...rest}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
