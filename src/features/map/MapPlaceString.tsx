import { Icon, type IconProps } from "@/components/shared/Icon";

type MapPlaceStringProps = {
  value: string | null | undefined;
  icon: IconProps["icon"];
};

export function MapPlaceString({ value, icon }: MapPlaceStringProps) {
  if (!value) return null;

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-2 px-3 py-2 text-xs hover:bg-stone-100">
      <Icon icon={icon} className="h-4 w-4 shrink-0 text-primary" />
      <p>{value}</p>
    </div>
  );
}