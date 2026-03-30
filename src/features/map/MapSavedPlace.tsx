import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/shared/Button";
import { useSelectedPlace } from "@/store";
import type { CreatePlaceInput, PlaceDto, PlaceResponse } from "@/lib/api/places";

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

  const { mutate, isPending } = useMutation({
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

  if (!selectedPlace) return null;

  function handleSave() {
    if (!selectedPlace) return;
    mutate({
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

  return (
    <div>
      {!savedPlace && (
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save place"}
        </Button>
      )}
      {savedPlace && <p>Saved place</p>}
    </div>
  );
}
