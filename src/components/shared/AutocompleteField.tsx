import { KeyboardEvent, useEffect, useId, useState } from "react";
import {
  Dropdown,
  DropdownContent,
  DropdownEmpty,
  DropdownItem,
  DropdownList,
  useDropdownContext,
} from "@/components/shared/dropdown";
import { TextField, type TextInputProps } from "@/components/shared/TextField";

export type AutocompleteItem<TValue = string> = {
  id: string;
  label: string;
  value: TValue;
  description?: string;
};

export type AutocompleteFieldProps<TValue = string> = Omit<
  TextInputProps,
  "afterInput" | "onChange" | "onSelect"
> & {
  items: AutocompleteItem<TValue>[];
  isLoading?: boolean;
  emptyMessage?: string;
  noResultsMessage?: string;
  onQueryChange: (value: string) => void;
  onSelect: (item: AutocompleteItem<TValue>) => void;
};

function AutocompleteFieldInner<TValue = string>({
  items,
  isLoading = false,
  emptyMessage = "Start typing to search",
  noResultsMessage = "No results found",
  onQueryChange,
  onSelect,
  onClear,
  onSearch,
  onFocus,
  onKeyDown,
  value,
  ...props
}: AutocompleteFieldProps<TValue>) {
  const { getReferenceProps, setReference, open, onOpenChange } = useDropdownContext();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const listboxId = useId();
  const hasQuery = String(value ?? "").trim().length > 0;

  function handleClear() {
    onQueryChange("");
    onOpenChange(false);
    setHighlightedIndex(-1);
    onClear?.();
  }
  const activeDescendantId =
    open && highlightedIndex >= 0
      ? `${listboxId}-item-${items[highlightedIndex]?.id}`
      : undefined;

  useEffect(() => {
    if (!open) setHighlightedIndex(-1);
  }, [open]);

  function handleSelect(item: AutocompleteItem<TValue>) {
    onSelect(item);
    onOpenChange(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

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
      if (item) handleSelect(item);
      return;
    }

    if (event.key === "Escape") {
      onOpenChange(false);
    }
  }

  return (
    <>
      <TextField
        {...props}
        {...getReferenceProps({
          "aria-expanded": open || undefined,
          "aria-controls": open ? listboxId : undefined,
          "aria-activedescendant": activeDescendantId,
        })}
        inputRef={setReference as (node: HTMLInputElement | null) => void}
        value={value}
        autoComplete="off"
        aria-autocomplete="list"
        onClear={onClear ? handleClear : undefined}
        onSearch={onSearch}
        onChange={(event) => {
          onQueryChange(event.target.value);
          onOpenChange(event.target.value.trim().length > 0);
          setHighlightedIndex(-1);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          if (isLoading || hasQuery || items.length > 0) {
            onOpenChange(true);
          }
        }}
        onKeyDown={handleKeyDown}
      />

      <DropdownContent id={listboxId}>
        {isLoading ? (
          <DropdownEmpty>Loading...</DropdownEmpty>
        ) : items.length > 0 ? (
          <DropdownList>
            {items.map((item, index) => (
              <DropdownItem
                key={item.id}
                id={`${listboxId}-item-${item.id}`}
                highlighted={highlightedIndex === index}
                onPointerEnter={() => setHighlightedIndex(index)}
                onSelect={() => handleSelect(item)}
              >
                <span>{item.label}</span>
                {item.description ? (
                  <span className="mt-0.5 text-xs text-zinc-500">
                    {item.description}
                  </span>
                ) : null}
              </DropdownItem>
            ))}
          </DropdownList>
        ) : (
          <DropdownEmpty>
            {hasQuery ? noResultsMessage : emptyMessage}
          </DropdownEmpty>
        )}
      </DropdownContent>
    </>
  );
}

export function AutocompleteField<TValue = string>(
  props: AutocompleteFieldProps<TValue>,
) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown open={isOpen} onOpenChange={setIsOpen} matchTriggerWidth>
      <AutocompleteFieldInner {...props} />
    </Dropdown>
  );
}
