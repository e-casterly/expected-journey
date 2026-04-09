import { type KeyboardEvent, useState } from "react";
import type { AutocompleteItem } from "@/components/shared/autocomplete";

type UseAutocompleteKeyboardOptions<TValue> = {
  items: AutocompleteItem<TValue>[];
  listboxId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: AutocompleteItem<TValue>) => void;
};

type UseAutocompleteKeyboardResult = {
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  activeDescendantId: string | undefined;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export function useAutocompleteKeyboard<TValue>({
  items,
  listboxId,
  open,
  onOpenChange,
  onSelect,
}: UseAutocompleteKeyboardOptions<TValue>): UseAutocompleteKeyboardResult {
  const [prevOpen, setPrevOpen] = useState(open);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Reset highlight when dropdown closes (derived state pattern — avoids setState in effect)
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (!open) setHighlightedIndex(-1);
  }

  const activeDescendantId =
    open && highlightedIndex >= 0
      ? `${listboxId}-item-${items[highlightedIndex]?.id}`
      : undefined;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open && event.key === "ArrowDown" && items.length > 0) {
      event.preventDefault();
      onOpenChange(true);
      setHighlightedIndex(0);
      return;
    }

    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) =>
        current < items.length - 1 ? current + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) =>
        current > 0 ? current - 1 : items.length - 1,
      );
      return;
    }

    if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault();
      const item = items[highlightedIndex];
      if (item) onSelect(item);
      return;
    }

    if (event.key === "Escape") {
      onOpenChange(false);
    }
  }

  return { highlightedIndex, setHighlightedIndex, activeDescendantId, handleKeyDown };
}
