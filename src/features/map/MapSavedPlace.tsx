import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedPlace } from "@/store";
import type { CreatePlaceInput, PlaceDto, PlaceResponse } from "@/lib/api/places";
import { IconButton } from "@/components/shared/IconButton";
import { Button } from "@/components/shared/Button";
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
    <div className="border-stroke flex flex-col items-start gap-2 border-b px-3 py-2">
      <Button
        disabled={isPending}
        isLoading={isPending}
        onClick={handleClick}
        variant="outline"
      >
        <Icon icon={savedPlace ? "BookmarkFulled" : "BookmarkAdd"} />
        {savedPlace ? "Remove place" : "Save place"}
      </Button>
    </div>
  );
}
