import type { PlaceDto } from "@/lib/api/places";
import {
  useSelectedPlace,
  useSetMarkerPosition,
  useSetSelectedPlace,
} from "@/store";
import cx from "classnames";

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

  return (
    <li className="group relative">
      <button
        className={cx(
          "w-full cursor-pointer rounded-xl border-2 px-4 py-3 text-left",
          isSelected
            ? "border-stroke-primary bg-primary text-foreground-inverse inset-shadow-card"
            : "text-foreground bg-primary-l border-primary-l hover:border-stroke-primary"
        )}
        onClick={handleClick}
      >
        <p className="text-lg font-medium">{place.name}</p>
        {place.notes && <p className="text-sm">{place.notes}</p>}
        {place.address && <p className="text-sm">{place.address}</p>}
      </button>
    </li>
  );
}
