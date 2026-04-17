import { useQuery } from "@tanstack/react-query";
import formatHostname from "@/lib/formatHostname";
import {
  useSelectedPlace,
  useSetMarkerPosition,
  useSetSelectedPlace,
} from "@/store";
import { MapSavedPlace } from "@/features/map/MapSavedPlace";
import { IconButton } from "@/components/shared/IconButton";
import { Spinner } from "@/components/shared/Spinner";
import { PlaceDetailed } from "@/lib/types/place";
import type { PlaceDto } from "@/lib/api/places";
import Image from "next/image";
import cx from "classnames";
import { MapPlaceString } from "@/features/map/MapPlaceString";
import { MapPlaceNote } from "@/features/map/MapPlaceNote";

export function MapPlaceInfo() {
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
  const coverUrl = wikidata?.imageUrl ?? wikidata?.logoUrl;

  if (!selectedPlace) {
    return null;
  }

  return (
    <div className="absolute top-14 bottom-3 left-3 z-10 flex w-sm flex-col overflow-hidden rounded-xl bg-white shadow-sm backdrop-blur">
      {isLoading && (
        <div className="flex flex-1 items-center justify-center px-3 pt-3">
          <Spinner className="h-10 w-10" />
        </div>
      )}
      {!isLoading && (
        <>
          {(coverUrl || wikidata?.logoUrl) && (
            <div
              className={cx(
                "relative w-full",
                coverUrl ? "h-40" : "flex items-center justify-center p-3"
              )}
            >
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt={selectedPlace.name}
                  fill
                  className="object-cover"
                  sizes="384px"
                />
              )}
              {wikidata?.logoUrl && (
                <div
                  className={cx({
                    "absolute top-3 left-3 rounded-xl bg-white p-2": coverUrl,
                  })}
                >
                  <Image
                    src={wikidata.logoUrl}
                    alt={`${selectedPlace.name} logo`}
                    width={120}
                    height={60}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          )}
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
          <div className="py-2 ps-3 pe-14 bg-olive-100">
            <p className="text-xl leading-snug font-medium">
              {selectedPlace.name}
            </p>
            {wikidata?.description && (
              <p className="text-xs">{wikidata.description}</p>
            )}
          </div>
          {selectedPlace.osmId && selectedPlace.osmType && (
            <MapSavedPlace savedPlace={savedPlace} />
          )}
          {savedPlace && (
            <MapPlaceNote key={savedPlace.id} place={savedPlace} />
          )}
          <MapPlaceString value={selectedPlace.address} icon="Location2" />
          <MapPlaceString
            value={`${selectedPlace.lat}, ${selectedPlace.lon}`}
            icon="Location"
          />
          <div className="flex flex-col gap-1 px-3 py-2 text-xs">
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
          </div>
        </>
      )}
    </div>
  );
}
