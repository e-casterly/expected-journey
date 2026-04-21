import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPlaceString } from "@/features/map/details/MapPlaceString";
import { Button } from "@/components/shared/Button";
import type { PlaceDto } from "@/lib/api/places";

type MapPlaceTagProps = {
  place: Pick<PlaceDto, "id" | "systemTags">;
};

export function MapPlaceTag({ place }: MapPlaceTagProps) {
  const queryClient = useQueryClient();
  const isStarred = place.systemTags.includes("starred");

  const { mutate: toggleStarred, isPending } = useMutation({
    mutationFn: () =>
      fetch(`/api/places/${place.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemTags: isStarred ? [] : ["starred"],
        }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });

  return (
    <MapPlaceString icon="Tag">
      <Button
        variant={isStarred ? "contained" : "outline"}
        size="s"
        isLoading={isPending}
        onClick={() => toggleStarred()}
        withIcon={isStarred ? "StarredFull" : "Starred"}
      >
        Starred
      </Button>
    </MapPlaceString>
  );
}
