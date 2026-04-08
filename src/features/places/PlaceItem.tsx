import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PlaceDto } from "@/lib/api/places";
import { useSetMarkerPosition, useSetSelectedPlace } from "@/store";
import { IconButton } from "@/components/shared/IconButton";
import { Dropdown } from "@/components/shared/dropdown";

type PlaceItemProps = {
  place: PlaceDto;
};

export function PlaceItem({ place }: PlaceItemProps) {
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
      lon: place.lon,
    });
  }

  function editPlace() {
    console.log("editPlace");
  }

  return (
    <li className="group relative">
      <button
        className="w-full cursor-pointer rounded-lg border border-zinc-200 px-4 py-3 text-left"
        onClick={handleClick}
      >
        <div>
          <p className="font-medium text-zinc-900">{place.name}</p>
          {place.address && (
            <p className="text-sm text-zinc-500">{place.address}</p>
          )}
        </div>
      </button>
      <div className="absolute top-2 right-2 flex gap-1">
        <Dropdown role="menu" clickToToggle>
          <Dropdown.Trigger asChild>
            <IconButton icon="More" label="More" />
          </Dropdown.Trigger>
          <Dropdown.Content className="min-w-32">
            <Dropdown.List>
              <Dropdown.MenuItem onSelectAction={editPlace} disabled={isPending}>
                Edit
              </Dropdown.MenuItem>
              <Dropdown.MenuItem onSelectAction={() => deletePlace()} disabled={isPending}>
                Delete
              </Dropdown.MenuItem>
            </Dropdown.List>
          </Dropdown.Content>
        </Dropdown>
      </div>
    </li>
  );
}
