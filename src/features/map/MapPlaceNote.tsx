import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TextareaField } from "@/components/shared/TextareaField";
import type { PlaceDto } from "@/lib/api/places";
import { Icon } from "@/components/shared/Icon";
import cx from "classnames";

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

  const generalClasses =
    "grid w-full grid-cols-[auto_1fr] items-center gap-2 px-4 py-2 border-stroke border-b bg-white text-sm text-primary text-left";

  if (isFieldShown) {
    return (
      <div className={generalClasses}>
        <Icon icon="Edit" className="h-6 w-6 shrink-0" />
        <TextareaField
          autoFocus
          placeholder="Note"
          value={noteValue}
          rows={2}
          onChange={(e) => setNoteValue(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
    );
  }

  return (
    <button
      className={cx(generalClasses, "hover:bg-primary-l cursor-pointer")}
      onClick={() => {
        if (!isFieldShown) {
          return setIsFieldShown(true);
        }
        setNoteValue(place.notes ?? "");
        setIsFieldShown(true);
      }}
    >
      <Icon icon="Edit" className="h-6 w-6 shrink-0" />
      {place.notes ? <p>{place.notes}</p> : <p>Add a note</p>}
    </button>
  );
}
