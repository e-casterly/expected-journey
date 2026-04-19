import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import cx from "classnames";
import { Spinner } from "@/components/shared/Spinner";

type ButtonVariant = "contained" | "outline" | "text" | "ghost";
type ButtonColor = "primary" | "secondary" | "destructive";
export type ButtonSize = "s" | "m" | "l";

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

  const outlineByColor: Record<ButtonColor, string> = {
    primary:
      "bg-white border-primary/90 text-primary/90 not-disabled:hover:border-primary not-disabled:hover:text-primary not-disabled:focus-visible:ring-primary",
    secondary:
      "bg-white not-disabled:hover:bg-gray-100 not-disabled:focus-visible:ring-secondary shadow-md",
    destructive:
      "bg-white not-disabled:hover:bg-destructive/90 not-disabled:focus-visible:ring-destructive",
  };


  const textByColor: Record<ButtonColor, string> = {
    primary:
      "text-primary-d not-disabled:hover:text-contrast not-disabled:focus-visible:text-contrast",
    secondary:
      "text-foreground not-disabled:hover:text-foreground/80 not-disabled:focus-visible:ring-foreground",
    destructive:
      "text-destructive not-disabled:hover:text-destructive/80 not-disabled:focus-visible:ring-destructive",
  };

  const variantClassNames: Record<ButtonVariant, string> = {
    contained:
      "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    outline:
      "rounded-md focus-visible:outline-none border focus-visible:ring-2",
    text: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    ghost: "not-disabled:hover:bg-gray-100",
  };

  const sizeClassNames: Record<ButtonSize, string> = {
    s: "h-6 px-4 py-2 text-sm font-medium",
    m: "h-9 px-4 py-2 text-base font-medium",
    l: "h-12 px-6 py-2 text-base font-medium",
  };

  const textSizeClassNames: Record<ButtonSize, string> = {
    s: "text-sm",
    m: "text-base",
    l: "text-l font-medium",
  };

  const commonClasses = cx(
    "inline-flex items-center justify-center",
    variantClassNames[variant],
    {
      [sizeClassNames[size]]: !isIcon && variant !== "text",
      [textSizeClassNames[size]]: variant === "text",
      "rounded-full p-1": isIcon,
      "w-full": fullWidth,
      [containedByColor[color]]: variant === "contained",
      [outlineByColor[color]]: variant === "outline",
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
