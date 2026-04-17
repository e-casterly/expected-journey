import type { PlaceDto } from "@/lib/api/places";
import { useSetMarkerPosition, useSetSelectedPlace } from "@/store";
import { IconButton } from "@/components/shared/IconButton";
import { Dropdown } from "@/components/shared/dropdown";

type PlaceItemProps = {
  place: PlaceDto;
};

export function PlaceItem({ place }: PlaceItemProps) {
  const setMarkerPosition = useSetMarkerPosition();
  const setSelectedPlace = useSetSelectedPlace();

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

  return (
    <li className="group relative">
      <button
        className="w-full cursor-pointer rounded-lg border border-zinc-200 px-4 py-3 text-left"
        onClick={handleClick}
      >
        <p className="font-medium ">{place.name}</p>
        {place.notes && <p className="text-sm ">{place.notes}</p>}
        {place.address && (
          <p className="text-sm text-zinc-500">{place.address}</p>
        )}
      </button>
    </li>
  );
}
