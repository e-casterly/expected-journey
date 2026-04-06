import formatHostname from "@/lib/formatHostname";
import {
  useSelectedPlace,
  useSetMarkerPosition,
  useSetSelectedPlace,
} from "@/store";
import { MapSavedPlace } from "@/features/map/MapSavedPlace";
import { IconButton } from "@/components/shared/IconButton";

export function MapPlaceInfo() {
  const selectedPlace = useSelectedPlace();
  const setSelectedPlace = useSetSelectedPlace();
  const setMarkerPosition = useSetMarkerPosition();

  const extras = selectedPlace?.extratags;
  if (!selectedPlace) {
    return null;
  }
  return (
    <div className="absolute top-14 bottom-3 left-3 z-10 w-sm overflow-hidden rounded-xl bg-white shadow-sm backdrop-blur">
      <IconButton
        className="absolute top-3 right-3"
        color="secondary"
        onClick={() => {
          setSelectedPlace(null);
          setMarkerPosition(null);
        }}
        icon="Close"
        label="Close"
      />
      <div className="bg-zinc-100 py-2 ps-3 pe-14">
        <p className="text-xl leading-snug font-medium text-zinc-900">
          {selectedPlace.name}
        </p>
      </div>
      <div className="flex flex-col gap-1 px-3 py-2 text-xs">
        {selectedPlace.osmId && selectedPlace.osmType && <MapSavedPlace />}
        {selectedPlace.address && <p>{selectedPlace.address}</p>}
        {extras?.phone && <p>{extras.phone}</p>}
        {extras?.email && (
          <a
            href={`mailto:${extras.email}`}
            className="truncate text-xs text-blue-600 hover:underline"
          >
            {extras.email}
          </a>
        )}
        {extras?.openingHours && <p>{extras.openingHours}</p>}
        {extras?.website && (
          <a
            href={extras.website}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-xs text-blue-600 hover:underline"
          >
            {formatHostname(extras.website)}
          </a>
        )}
        {extras?.instagram && <p>{extras.instagram}</p>}
        <p>
          {selectedPlace.lat}, {selectedPlace.lon}
        </p>
      </div>
    </div>
  );
}