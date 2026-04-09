import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import type { SelectOption } from "@/components/shared/select";

type UseSelectKeyboardOptions<TValue> = {
  options: SelectOption<TValue>[];
  listboxId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  initialHighlightIndex: number;
  onSelect: (option: SelectOption<TValue>) => void;
};

type UseSelectKeyboardResult = {
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  activeDescendantId: string | undefined;
  handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
};

export function useSelectKeyboard<TValue>({
  options,
  listboxId,
  open,
  onOpenChange,
  disabled = false,
  initialHighlightIndex,
  onSelect,
}: UseSelectKeyboardOptions<TValue>): UseSelectKeyboardResult {
  const [prevOpen, setPrevOpen] = useState(open);
  const [highlightedIndex, setHighlightedIndex] = useState(open ? initialHighlightIndex : -1);
  const typeaheadRef = useRef("");
  const typeaheadTimeoutRef = useRef<number | null>(null);

  // Sync highlight with open/close transitions (derived state pattern — avoids setState in effect)
  if (prevOpen !== open) {
    setPrevOpen(open);
    setHighlightedIndex(open ? initialHighlightIndex : -1);
  }

  const activeDescendantId =
    open && highlightedIndex >= 0
      ? `${listboxId}-option-${options[highlightedIndex]?.id}`
      : undefined;

  useEffect(() => {
    return () => {
      if (typeaheadTimeoutRef.current !== null) {
        window.clearTimeout(typeaheadTimeoutRef.current);
      }
    };
  }, []);

  function handleTypeahead(char: string) {
    if (typeaheadTimeoutRef.current !== null) {
      window.clearTimeout(typeaheadTimeoutRef.current);
    }

    typeaheadRef.current += char.toLowerCase();
    typeaheadTimeoutRef.current = window.setTimeout(() => {
      typeaheadRef.current = "";
    }, 500);

    const search = typeaheadRef.current;
    const startIndex = open ? highlightedIndex : initialHighlightIndex;
    const afterCurrent = options.findIndex(
      (opt, i) => i > startIndex && opt.label.toLowerCase().startsWith(search),
    );
    const found =
      afterCurrent >= 0
        ? afterCurrent
        : options.findIndex((opt) => opt.label.toLowerCase().startsWith(search));

    if (found >= 0) {
      setHighlightedIndex(found);
      if (!open) onOpenChange(true);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (!open) {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === " " ||
        event.key === "Enter"
      ) {
        event.preventDefault();
        onOpenChange(true);
        setHighlightedIndex(initialHighlightIndex);
        return;
      }
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        handleTypeahead(event.key);
        return;
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) =>
        current < options.length - 1 ? current + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) =>
        current > 0 ? current - 1 : options.length - 1,
      );
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[highlightedIndex];
      if (option) onSelect(option);
      return;
    }

    if (event.key === "Escape") {
      onOpenChange(false);
      return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      handleTypeahead(event.key);
    }
  }

  return { highlightedIndex, setHighlightedIndex, activeDescendantId, handleKeyDown };
}