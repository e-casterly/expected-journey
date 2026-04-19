import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedPlace } from "@/store";
import type { CreatePlaceInput, PlaceDto, PlaceResponse } from "@/lib/api/places";
import { Icon } from "@/components/shared/Icon";

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

  // const isPending = isSaving || isRemoving;

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
    <button
      onClick={handleClick}
      className="border-stroke hover:bg-primary-l text-primary grid cursor-pointer grid-cols-[auto_1fr] items-center gap-2 border-b bg-white px-4 py-2 text-left text-sm"
    >
      <Icon
        icon={savedPlace ? "BookmarkFulled" : "BookmarkAdd"}
        className="h-6 w-6 shrink-0"
      />
      {savedPlace ? "Saved place" : "Save place"}
    </button>
  );
}
