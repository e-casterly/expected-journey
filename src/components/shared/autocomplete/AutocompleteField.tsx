import { type FocusEvent, type KeyboardEvent, useId } from "react";
import { Dropdown, useDropdownContext } from "@/components/shared/dropdown";
import { IconButton } from "@/components/shared/IconButton";
import { useAutocompleteKeyboard } from "@/components/shared/autocomplete/useAutocompleteKeyboard";
import type { AutocompleteItem } from "@/components/shared/autocomplete";

export type AutocompleteFieldProps<TValue = string> = {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
  noResultsMessage?: string;
  items: AutocompleteItem<TValue>[];
  onQueryChange: (value: string) => void;
  onSelect: (item: AutocompleteItem<TValue>) => void;
  onClear?: () => void;
  onSearch?: () => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
};

function AutocompleteFieldInner<TValue = string>({
  value,
  placeholder,
  disabled,
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
}: AutocompleteFieldProps<TValue>) {
  const { getReferenceProps, setReference, open, onOpenChange } = useDropdownContext();

  const listboxId = useId();
  const hasQuery = String(value ?? "").trim().length > 0;

  function handleSelect(item: AutocompleteItem<TValue>) {
    onSelect(item);
    onOpenChange(false);
  }

  // Ensure the dropdown is open when search is triggered (button click or Enter),
  // so results are visible once they arrive.
  function handleSearch() {
    onOpenChange(true);
    onSearch?.();
  }

  const { highlightedIndex, setHighlightedIndex, activeDescendantId, handleKeyDown } =
    useAutocompleteKeyboard({
      items,
      listboxId,
      open,
      onOpenChange,
      onSelect: handleSelect,
      onSearch: handleSearch,
    });

  function handleClear() {
    onQueryChange("");
    onOpenChange(false);
    onClear?.();
  }

  const shouldOpenOnFocus = isLoading || hasQuery || items.length > 0;

  return (
    <>
      <div
        className="relative"
        ref={setReference as (node: HTMLDivElement | null) => void}
      >
        <input
          {...getReferenceProps({
            "aria-expanded": open || undefined,
            "aria-controls": open ? listboxId : undefined,
            "aria-activedescendant": activeDescendantId,
          })}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          aria-autocomplete="list"
          className="text-foreground shadow-field inset-shadow-field focus:ring-contrast border-stroke placeholder:text-placeholder h-10 w-full rounded-full border bg-field-secondary px-4 py-2 text-base transition focus:ring-2 focus:outline-none disabled:cursor-default disabled:opacity-50"
          onChange={(e) => {
            onQueryChange(e.target.value);
            onOpenChange(e.target.value.trim().length > 0);
            setHighlightedIndex(-1);
          }}
          onFocus={(e) => {
            onFocus?.(e);
            if (shouldOpenOnFocus) onOpenChange(true);
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (!e.defaultPrevented) handleKeyDown(e);
          }}
        />
        <div className="text-icon-field absolute inset-y-0 right-0 flex items-center gap-0.5 pr-2">
          {hasQuery && onSearch && (
            <IconButton
              onClick={onSearch}
              onMouseDown={(e) => e.preventDefault()}
              label="Search"
              icon="Search"
              size="l"
            />
          )}
          {hasQuery && onClear && (
            <IconButton
              onClick={handleClear}
              onMouseDown={(e) => e.preventDefault()}
              label="Clear"
              icon="Close"
              size="l"
            />
          )}
        </div>
      </div>

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
                {item.description && (
                  <span className="mt-0.5 text-xs text-zinc-500">
                    {item.description}
                  </span>
                )}
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
