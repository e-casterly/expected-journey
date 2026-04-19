import { type ComponentPropsWithoutRef } from "react";
import { Icon, type IconProps } from "@/components/shared/Icon";

type MapPlaceStringProps = {
  string: string | null | undefined;
  icon: IconProps["icon"];
} & Pick<ComponentPropsWithoutRef<"a">, "href" | "target" | "rel">;

export function MapPlaceString({
  string,
  icon,
  href,
  target,
  rel,
}: MapPlaceStringProps) {
  if (!string) return null;

  const Tag = href ? "a" : "div";

  return (
    <Tag
      href={href}
      target={target}
      rel={rel}
      className="text-foreground border-stroke hover:bg-primary-l grid grid-cols-[auto_1fr] items-center gap-2 border-b bg-white px-4 py-2 text-sm"
    >
      <Icon icon={icon} className="h-6 w-6 shrink-0" />
      <span>{string}</span>
    </Tag>
  );
}