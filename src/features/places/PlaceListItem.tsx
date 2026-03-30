import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/shared/Button";
import type { PlaceDto } from "@/lib/api/places";
import { Icon } from "@/components/shared/Icon";

type PlaceListItemProps = {
  place: PlaceDto;
};

export function PlaceListItem({ place }: PlaceListItemProps) {
  const queryClient = useQueryClient();

  const { mutate: deletePlace, isPending } = useMutation({
    mutationFn: () => fetch(`/api/places/${place.id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });

  return (
    <li className="group flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
      <div>
        <p className="font-medium text-zinc-900">{place.name}</p>
        {place.address && (
          <p className="text-sm text-zinc-500">{place.address}</p>
        )}
      </div>
      <div className="invisible group-hover:visible flex gap-1">
        <Button variant="icon">
          <Icon icon={"Edit"} />
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