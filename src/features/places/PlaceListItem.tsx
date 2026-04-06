import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/shared/Button";
import type { PlaceDto } from "@/lib/api/places";
import { Icon } from "@/components/shared/Icon";
import { useSetMarkerPosition, useSetSelectedPlace } from "@/store";

type PlaceListItemProps = {
  place: PlaceDto;
};

export function PlaceListItem({ place }: PlaceListItemProps) {
  const queryClient = useQueryClient();
  const setMarkerPosition = useSetMarkerPosition();
  const setSelectedPlace = useSetSelectedPlace();

  const { mutate: deletePlace, isPending } = useMutation({
    mutationFn: () => fetch(`/api/places/${place.id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });

  function handleClick() {
    setMarkerPosition({ lat: place.lat, lon: place.lon });
    setSelectedPlace({
      id: place.id,
      name: place.name,
      address: place.address ?? "",
      osmType: place.osmType ?? "",
      osmId: place.osmId ?? 0,
      lat: place.lat,
      lon: place.lon
    });
  }

  return (
    <li className="group relative">
      <button
        className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-left cursor-pointer"
        onClick={handleClick}
      >
        <div>
          <p className="font-medium text-zinc-900">{place.name}</p>
          {place.address && (
            <p className="text-sm text-zinc-500">{place.address}</p>
          )}
        </div>
      </button>
      <div className="invisible absolute top-2 right-2 flex gap-1 group-hover:visible">
        <Button isIcon>
          <Icon icon="Edit" />
        </Button>
        <Button
          variant="contained"
          color="destructive"
          disabled={isPending}
          onClick={() => deletePlace()}
        >
          Delete
        </Button>
      </div>
    </li>
  );
}