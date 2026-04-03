import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import cx from "classnames";

type ButtonVariant = "contained" | "link" | "icon" | "none";
type ButtonColor = "primary" | "secondary" | "destructive";

type ButtonBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
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
  ...props
}: ButtonProps) {
  const containedByColor: Record<ButtonColor, string> = {
    primary:
      "bg-primary not-disabled:hover:bg-primary/90 not-disabled:focus-visible:ring-primary text-white",
    secondary:
      "bg-secondary not-disabled:hover:bg-gray-100 not-disabled:focus-visible:ring-secondary",
    destructive:
      "bg-destructive not-disabled:hover:bg-destructive/90 not-disabled:focus-visible:ring-destructive text-white",
  };

  const linkByColor: Record<ButtonColor, string> = {
    primary:
      "text-primary not-disabled:hover:text-primary/80 not-disabled:focus-visible:ring-primary",
    secondary:
      "text-secondary not-disabled:hover:text-secondary/80 not-disabled:focus-visible:ring-secondary",
    destructive:
      "text-destructive not-disabled:hover:text-destructive/80 not-disabled:focus-visible:ring-destructive",
  };

  const iconByColor: Record<ButtonColor, string> = {
    primary:
      "bg-primary not-disabled:hover:bg-primary/90 not-disabled:focus-visible:ring-primary text-white",
    secondary:
      "bg-white not-disabled:hover:bg-gray-100 not-disabled:focus-visible:ring-gray-100",
    destructive:
      "bg-destructive not-disabled:hover:bg-destructive/90 not-disabled:focus-visible:ring-destructive",
  };

  const variantClassNames: Record<ButtonVariant, string> = {
    contained:
      "h-9 px-4 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    link: "underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    icon: "h-9 w-9 p-0 rounded-md shadow-md",
    none: "",
  };

  const commonClasses = cx(
    variantClassNames[variant],
    {
      "inline-flex items-center justify-center text-base font-medium": variant !== "none",
      "w-full": fullWidth,
      [iconByColor[color]]: variant === "icon",
      [containedByColor[color]]: variant === "contained",
      [linkByColor[color]]: variant === "link",
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
      {isLoading && <span>Loading</span>}
      {children}
    </button>
  );
}
