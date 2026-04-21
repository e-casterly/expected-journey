import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedPlace } from "@/store";
import type { CreatePlaceInput, PlaceDto, PlaceResponse } from "@/lib/api/places";
import { MapPlaceString } from "@/features/map/details/MapPlaceString";

type MapSavedPlaceProps = {
  savedPlace: PlaceDto | null | undefined;
};

export function MapSavedPlace({ savedPlace }: MapSavedPlaceProps) {
  const selectedPlace = useSelectedPlace();
  const queryClient = useQueryClient();

  const { mutate: savePlace, isPending: isSaving } = useMutation({
    mutationFn: (input: CreatePlaceInput) =>
      fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }).then((r) => r.json() as Promise<PlaceResponse>),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });

  const { mutate: removePlace, isPending: isRemoving } = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/places/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });

  if (!selectedPlace) return null;

  const isPending = isSaving || isRemoving;

  function handleClick() {
    if (!selectedPlace) return;
    if (savedPlace) {
      removePlace(savedPlace.id);
    } else {
      savePlace({
        name: selectedPlace.name,
        address: selectedPlace.address ?? undefined,
        lat: selectedPlace.lat,
        lon: selectedPlace.lon,
        osmType: selectedPlace.osmType ?? undefined,
        osmId: selectedPlace.osmId ?? undefined,
        tagIds: [],
        systemTags: [],
      });
    }
  }

  return (
    <MapPlaceString
      onClick={handleClick}
      variant="savedProperty"
      icon={savedPlace ? "BookmarkFulled" : "BookmarkAdd"}
      className="group"
      isLoading={isPending}
    >
      {savedPlace ? (
        <>
          <span className="group-hover:hidden">Saved</span>
          <span className="hidden group-hover:block">
            Remove the place from your list
          </span>
        </>
      ) : (
        <span>Save this place to find it later</span>
      )}
    </MapPlaceString>
  );
}
