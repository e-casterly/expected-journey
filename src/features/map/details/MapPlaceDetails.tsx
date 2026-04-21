import { useQuery } from "@tanstack/react-query";
import formatHostname from "@/lib/formatHostname";
import {
  useSelectedPlace,
  useSetMarkerPosition,
  useSetSelectedPlace,
} from "@/store";
import { MapSavedPlace } from "@/features/map/details/MapSavedPlace";
import { IconButton } from "@/components/shared/IconButton";
import { Spinner } from "@/components/shared/Spinner";
import { PlaceDetailed } from "@/lib/types/place";
import type { PlaceDto } from "@/lib/api/places";
import Image from "next/image";
import cx from "classnames";
import { MapPlaceString } from "@/features/map/details/MapPlaceString";
import { MapPlaceNote } from "@/features/map/details/MapPlaceNote";
import { MapPlaceCopyable } from "@/features/map/details/MapPlaceCopyable";
import { MapPlaceTag } from "@/features/map/details/MapPlaceTag";

export function MapPlaceDetails() {
  const selectedPlace = useSelectedPlace();
  const setSelectedPlace = useSetSelectedPlace();
  const setMarkerPosition = useSetMarkerPosition();

  const { data: detailedPlace, isLoading: isLookupLoading } = useQuery({
    queryKey: ["geocode/lookup", selectedPlace?.osmType, selectedPlace?.osmId],
    queryFn: async () => {
      const params = new URLSearchParams({
        osm_type: selectedPlace!.osmType,
        osm_id: String(selectedPlace!.osmId),
      });
      const r = await fetch(`/api/geocode/lookup?${params}`);
      const result: PlaceDetailed = await r.json();
      return result;
    },
    enabled: !!selectedPlace?.osmId && !!selectedPlace?.osmType,
  });

  const { data: savedPlace, isLoading: isSavedPlaceLoading } = useQuery<PlaceDto | null>({
    queryKey: ["places", "osm", selectedPlace?.osmType, selectedPlace?.osmId],
    queryFn: async () => {
      const params = new URLSearchParams({
        osmType: selectedPlace!.osmType!,
        osmId: String(selectedPlace!.osmId),
      });
      const r = await fetch(`/api/places?${params}`);
      const data = await r.json();
      return data.place as PlaceDto | null;
    },
    enabled: !!selectedPlace?.osmType && !!selectedPlace?.osmId,
  });

  const isLoading = isLookupLoading || isSavedPlaceLoading;

  const extras = detailedPlace?.extratags;
  const wikidata = detailedPlace?.wikidata;
  const coverUrl = wikidata?.imageUrl;

  if (!selectedPlace) {
    return null;
  }

  return (
    <div className="shadow-card absolute top-16 bottom-3 left-3 z-10 flex w-sm flex-col overflow-hidden rounded-3xl bg-white/90">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center px-3 pt-3">
          <Spinner className="h-10 w-10" />
        </div>
      ) : (
        <>
          {coverUrl && (
            <div
              className={cx(
                "relative w-full",
                coverUrl ? "h-40" : "flex items-center justify-center p-3"
              )}
            >
              <Image
                src={coverUrl}
                alt={selectedPlace.name}
                fill
                className="object-cover"
                sizes="384px"
              />
            </div>
          )}
          <IconButton
            className="absolute top-2 right-3"
            color="secondary"
            onClick={() => {
              setSelectedPlace(null);
              setMarkerPosition(null);
            }}
            icon="Close"
            label="Close"
          />
          <div
            className={cx(
              "border-stroke border-b-2 py-2 ps-4",
              !coverUrl ? "pe-14" : "pe-4"
            )}
          >
            <p className="text-lg font-medium">{selectedPlace.name}</p>
            {wikidata?.description && (
              <p className="text-sm">{wikidata.description}</p>
            )}
          </div>
          {selectedPlace.osmId && selectedPlace.osmType && (
            <MapSavedPlace savedPlace={savedPlace} />
          )}
          {savedPlace && <MapPlaceNote place={savedPlace} />}
          {savedPlace && <MapPlaceTag place={savedPlace} />}
          {selectedPlace.address && (
            <MapPlaceCopyable string={selectedPlace.address} icon="Location2" />
          )}
          {selectedPlace.lat && selectedPlace.lon && (
            <MapPlaceCopyable
              string={`${selectedPlace.lat}, ${selectedPlace.lon}`}
              icon="Location"
            />
          )}
          {extras?.phone && (
            <MapPlaceString
              string={extras?.phone}
              href={`tel:${extras.phone}`}
              icon="Phone"
            />
          )}
          {extras?.website && (
            <MapPlaceString
              href={extras.website}
              target="_blank"
              rel="noopener noreferrer"
              string={formatHostname(extras?.website)}
              icon="Website"
            />
          )}
          <div className="flex flex-col gap-1 px-3 py-2 text-xs">
            {extras?.email && (
              <a
                href={`mailto:${extras.email}`}
                className="truncate text-xs text-blue-600 hover:underline"
              >
                {extras.email}
              </a>
            )}
            {extras?.openingHours && <p>{extras.openingHours}</p>}
            {extras?.instagram && <p>{extras.instagram}</p>}
          </div>
        </>
      )}
    </div>
  );
}
