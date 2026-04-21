import { useState } from "react";
import { MapPlaceString } from "@/features/map/details/MapPlaceString";
import { Icon, type IconProps } from "@/components/shared/Icon";

type MapPlaceCopyableProps = {
  string: string;
  icon: IconProps["icon"];
};

export function MapPlaceCopyable({ string, icon }: MapPlaceCopyableProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(string);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <MapPlaceString icon={icon} onClick={handleCopy} string={string} className="group pe-7">
      <Icon icon="Copy" className="absolute right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 group-hover:block" />
      {copied && <span className="ms-1 text-green-600">Copied!</span>}
    </MapPlaceString>
  );
}
