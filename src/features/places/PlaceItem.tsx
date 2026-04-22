import type { PlaceDto } from "@/lib/api/places";
import {
  useSelectedPlace,
  useSetMarkerPosition,
  useSetSelectedPlace,
} from "@/store";
import cx from "classnames";
import { Icon } from "@/components/shared/Icon";

type PlaceItemProps = {
  place: PlaceDto;
};

export function PlaceItem({ place }: PlaceItemProps) {
  const setMarkerPosition = useSetMarkerPosition();
  const setSelectedPlace = useSetSelectedPlace();
  const selectedPlace = useSelectedPlace();

  function handleClick() {
    setMarkerPosition({ lat: place.lat, lon: place.lon });
    setSelectedPlace({
      id: place.id,
      name: place.name,
      address: place.address ?? "",
      osmType: place.osmType ?? "",
      osmId: place.osmId ?? 0,
      lat: place.lat,
      lon: place.lon,
    });
  }

  const isSelected = selectedPlace?.id === place.id;
  const isStarred = place.systemTags.includes("starred");

  return (
    <li className="group relative">
      <button
        className={cx(
          "flex w-full cursor-pointer flex-col gap-0.5 rounded-xl border-2 py-3 ps-4 text-left",
          isSelected
            ? "border-stroke-primary bg-primary text-foreground-inverse inset-shadow-card"
            : "text-foreground bg-primary-l border-primary-l hover:border-stroke-primary",
          isStarred ? "pe-8" : "pe-4"
        )}
        onClick={handleClick}
      >
        {place.systemTags.includes("starred") && (
          <div className="bg-contrast text-foreground-inverse absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center self-start rounded-full text-sm">
            <Icon icon="StarredFull" className="h-4 w-4" />
          </div>
        )}
        <p className="text-lg font-medium">{place.name}</p>
        {place.notes && <p className="text-sm">{place.notes}</p>}
        {place.address && <p className="text-sm">{place.address}</p>}
      </button>
    </li>
  );
}
