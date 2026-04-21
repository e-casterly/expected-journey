import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TextareaField } from "@/components/shared/TextareaField";
import type { PlaceDto } from "@/lib/api/places";
import { MapPlaceString } from "@/features/map/details/MapPlaceString";

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

  function handleField() {
    setNoteValue(place.notes ?? "");
    setIsFieldShown(true);
  }

  return (
    <MapPlaceString
      variant="savedProperty"
      icon="Edit"
      onClick={isFieldShown ? undefined : handleField}
    >
      {isFieldShown ? (
        <TextareaField
          autoFocus
          placeholder="Note"
          value={noteValue}
          rows={2}
          onChange={(e) => setNoteValue(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <p>{place.notes ? place.notes : "Add a note"}</p>
      )}
    </MapPlaceString>
  );
}
