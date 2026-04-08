import { useId } from "react";
import { Dropdown, useDropdownContext } from "@/components/shared/dropdown";
import { TextField, type TextInputProps } from "@/components/shared/TextField";
import { useAutocompleteKeyboard } from "@/components/shared/autocomplete/useAutocompleteKeyboard";
import type { AutocompleteItem } from "@/components/shared/autocomplete";

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
  const listboxId = useId();
  const hasQuery = String(value ?? "").trim().length > 0;

  function handleSelect(item: AutocompleteItem<TValue>) {
    onSelect(item);
    onOpenChange(false);
  }

  const { highlightedIndex, setHighlightedIndex, activeDescendantId, handleKeyDown } =
    useAutocompleteKeyboard({ items, listboxId, open, onOpenChange, onSelect: handleSelect });

  function handleClear() {
    onQueryChange("");
    onOpenChange(false);
    onClear?.();
  }

  const shouldOpenOnFocus = isLoading || hasQuery || items.length > 0;

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
          if (shouldOpenOnFocus) onOpenChange(true);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (!event.defaultPrevented) handleKeyDown(event);
        }}
      />

      <Dropdown.Content id={listboxId}>
        {isLoading ? (
          <Dropdown.Empty>Loading...</Dropdown.Empty>
        ) : items.length > 0 ? (
          <Dropdown.List>
            {items.map((item, index) => (
              <Dropdown.Option
                key={item.id}
                id={`${listboxId}-item-${item.id}`}
                highlighted={highlightedIndex === index}
                onPointerEnter={() => setHighlightedIndex(index)}
                onSelectAction={() => handleSelect(item)}
              >
                <span>{item.label}</span>
                {item.description ? (
                  <span className="mt-0.5 text-xs text-zinc-500">
                    {item.description}
                  </span>
                ) : null}
              </Dropdown.Option>
            ))}
          </Dropdown.List>
        ) : (
          <Dropdown.Empty>
            {hasQuery ? noResultsMessage : emptyMessage}
          </Dropdown.Empty>
        )}
      </Dropdown.Content>
    </>
  );
}

export function AutocompleteField<TValue = string>(
  props: AutocompleteFieldProps<TValue>,
) {
  return (
    <Dropdown matchTriggerWidth>
      <AutocompleteFieldInner {...props} />
    </Dropdown>
  );
}
