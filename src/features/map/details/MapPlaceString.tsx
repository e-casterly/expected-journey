import { type ComponentPropsWithoutRef, ReactNode } from "react";
import { Icon, type IconProps } from "@/components/shared/Icon";
import cx from "classnames";
import { Spinner } from "@/components/shared/Spinner";

type MapPlaceStringProps = {
  className?: string;
  string?: string;
  isLoading?: boolean;
  icon: IconProps["icon"];
  onClick?: () => void;
  variant?: "other" | "savedProperty";
  children?: ReactNode;
} & Pick<ComponentPropsWithoutRef<"a">, "href" | "target" | "rel">;

export function MapPlaceString({
  className,
  string,
                                 isLoading,
  icon,
  href,
  target,
  rel,
  onClick,
  variant = "other",
  children,
}: MapPlaceStringProps) {
  const Tag = href ? "a" : onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      href={href}
      target={target}
      rel={rel}
      className={cx(
        "border-stroke relative grid grid-cols-[auto_1fr] items-center gap-2 border-b px-4 py-2 text-left text-sm",
        {
          "text-foreground": variant === "other",
          "text-primary": variant === "savedProperty",
          "hover:bg-primary-l cursor-pointer bg-white":
            Tag === "a" || Tag === "button",
        },
        className
      )}
    >
      <Icon icon={icon} className="h-6 w-6 shrink-0" />
      <div>
        {isLoading ? (
          <Spinner className="h-6 w-6" />
        ) : (
          <>
            {string && <span>{string}</span>}
            {children}
          </>
        )}
      </div>
    </Tag>
  );
}
