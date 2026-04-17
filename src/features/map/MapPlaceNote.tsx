import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TextareaField } from "@/components/shared/TextareaField";
import { Button } from "@/components/shared/Button";
import type { PlaceDto } from "@/lib/api/places";
import { Icon } from "@/components/shared/Icon";

type MapPlaceNoteProps = {
  place: Pick<PlaceDto, "id" | "notes">;
};

export function MapPlaceNote({ place }: MapPlaceNoteProps) {
  const queryClient = useQueryClient();
  const [isFieldShown, setIsFieldShown] = useState(false);
  const [noteValue, setNoteValue] = useState(place.notes ?? "");

  const { mutate: saveNote } = useMutation({
    mutationFn: (notes: string) =>
      fetch(`/api/places/${place.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["places"] });
    },
    onError: () => setIsFieldShown(true),
  });

  function handleBlur() {
    if (noteValue !== (place.notes ?? "")) {
      saveNote(noteValue);
    }
    setIsFieldShown(false);
  }

  if (isFieldShown) {
    return (
      <div className="grid w-full grid-cols-[auto_1fr] items-center gap-2 px-3 py-2">
        <Icon icon="Edit" className="text-primary h-4 w-4 shrink-0" />
        <TextareaField
          autoFocus
          placeholder="Note"
          value={noteValue}
          rows={2}
          onChange={(e) => setNoteValue(e.target.value)}
          onBlur={handleBlur}
          size="s"
        />
      </div>
    );
  }

  if (place.notes) {
    return (
      <button
        className="grid w-full cursor-pointer grid-cols-[auto_1fr] items-center gap-2 px-3 py-2 text-left hover:bg-stone-100"
        onClick={() => {
          setNoteValue(place.notes ?? "");
          setIsFieldShown(true);
        }}
      >
        <Icon icon="Edit" className="text-primary h-4 w-4 shrink-0" />
        <p className="text-xs">{place.notes}</p>
      </button>
    );
  }

  return (
    <div className="w-full px-3 py-2">
      <Button variant="outline" size="s" onClick={() => setIsFieldShown(true)}>
        Add a note
      </Button>
    </div>
  );
}
