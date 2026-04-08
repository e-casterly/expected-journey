import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelectedPlace } from "@/store";
import type { CreatePlaceInput, PlaceDto, PlaceResponse } from "@/lib/api/places";
import { IconButton } from "@/components/shared/IconButton";

export function MapSavedPlace() {
  const selectedPlace = useSelectedPlace();
  const queryClient = useQueryClient();

  const { data: savedPlace } = useQuery<PlaceDto | null>({
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
    <div className="flex gap-1 px-3 pt-2">
      <IconButton
        onClick={handleClick}
        disabled={isPending}
        variant="outline"
        size="m"
        label={savedPlace ? "Remove place" : "Save place"}
        isLoading={isPending}
        icon={savedPlace ? "BookmarkFulled" : "BookmarkAdd"}
      />
    </div>
  );
}
