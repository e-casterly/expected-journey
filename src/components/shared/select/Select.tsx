"use client";

import { type ComponentPropsWithoutRef, useId, useState } from "react";
import classNames from "classnames";
import {
  Dropdown,
  DropdownContent,
  DropdownEmpty,
  DropdownItem,
  DropdownList,
  useDropdownContext,
} from "@/components/shared/dropdown";
import { Label } from "@/components/shared/Label";
import { ErrorList } from "@/components/shared/ErrorList";
import { useSelectKeyboard } from "./useSelectKeyboard";

export type SelectOption<TValue = string> = {
  id: string;
  label: string;
  value: TValue;
};

type SelectBaseProps<TValue> = {
  options: SelectOption<TValue>[];
  placeholder?: string;
  label?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  errorMessages?: string[];
  disabled?: boolean;
  name?: string;
  emptyMessage?: string;
  onBlur?: () => void;
};

export type SelectSingleProps<TValue = string> = SelectBaseProps<TValue> & {
  multiple?: false;
  value: TValue | null;
  onChange: (value: TValue) => void;
};

export type SelectMultipleProps<TValue = string> = SelectBaseProps<TValue> & {
  multiple: true;
  value: TValue[];
  onChange: (value: TValue[]) => void;
};

export type SelectProps<TValue = string> =
  | SelectSingleProps<TValue>
  | SelectMultipleProps<TValue>;

function CheckboxOption({ label, selected }: { label: string; selected: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={classNames(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          selected ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300",
        )}
        aria-hidden="true"
      >
        {selected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3"
          >
            <path
              fillRule="evenodd"
              d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
      {label}
    </span>
  );
}

function SelectInner<TValue = string>(props: SelectProps<TValue>) {
  const {
    options,
    placeholder = "Select an option",
    label,
    labelClassName,
    wrapperClassName,
    errorMessages,
    disabled = false,
    name,
    emptyMessage = "No options available",
    onBlur,
  } = props;

  const { getReferenceProps, setReference, open, onOpenChange } =
    useDropdownContext();
  const triggerId = useId();
  const listboxId = useId();
  const errorId = useId();

  const showError = Boolean(errorMessages?.length);

  function isOptionSelected(optionValue: TValue): boolean {
    if (props.multiple) return props.value.includes(optionValue);
    return props.value === optionValue;
  }

  const selectedIndex = props.multiple
    ? -1
    : options.findIndex((o) => o.value === props.value);

  function handleSelect(option: SelectOption<TValue>) {
    if (props.multiple) {
      const current = props.value;
      const next = current.includes(option.value)
        ? current.filter((v) => v !== option.value)
        : [...current, option.value];
      props.onChange(next);
    } else {
      props.onChange(option.value);
      onOpenChange(false);
    }
  }

  const { highlightedIndex, setHighlightedIndex, activeDescendantId, handleKeyDown } =
    useSelectKeyboard({
      options,
      listboxId,
      open,
      onOpenChange,
      disabled,
      initialHighlightIndex: selectedIndex >= 0 ? selectedIndex : 0,
      onSelect: handleSelect,
    });

  function getTriggerLabel(): string | null {
    if (props.multiple) {
      if (props.value.length === 0) return null;
      if (props.value.length === 1) {
        return options.find((o) => o.value === props.value[0])?.label ?? null;
      }
      return `${props.value.length} selected`;
    }
    return options.find((o) => o.value === props.value)?.label ?? null;
  }

  const triggerLabel = getTriggerLabel();

  return (
    <div className={classNames("w-full", wrapperClassName)}>
      {label && (
        <Label htmlFor={triggerId} className={labelClassName}>
          {label}
        </Label>
      )}
      {name && (
        props.multiple ? (
          props.value.map((v) => (
            <input key={String(v)} type="hidden" name={name} value={String(v)} />
          ))
        ) : (
          <input
            type="hidden"
            name={name}
            value={props.value != null ? String(props.value) : ""}
          />
        )
      )}
      <button
        id={triggerId}
        ref={setReference as (node: HTMLButtonElement | null) => void}
        type="button"
        disabled={disabled}
        aria-controls={open ? listboxId : undefined}
        aria-invalid={showError || undefined}
        aria-describedby={showError ? errorId : undefined}
        aria-activedescendant={activeDescendantId}
        className={classNames(
          "mt-0.5 flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-left text-sm transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none",
          showError ? "border-destructive" : "border-stroke",
          disabled && "cursor-not-allowed opacity-50",
        )}
        {...(getReferenceProps({ onKeyDown: handleKeyDown, onBlur }) as ComponentPropsWithoutRef<"button">)}
      >
        <span className={classNames(!triggerLabel && "text-zinc-500")}>
          {triggerLabel ?? placeholder}
        </span>
        <svg
          className={classNames(
            "h-4 w-4 shrink-0 text-zinc-500 transition-transform",
            open && "rotate-180",
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <DropdownContent
        id={listboxId}
        aria-multiselectable={props.multiple || undefined}
      >
        {options.length > 0 ? (
          <DropdownList>
            {options.map((option, index) => {
              const selected = isOptionSelected(option.value);
              return (
                <DropdownItem
                  key={option.id}
                  id={`${listboxId}-option-${option.id}`}
                  highlighted={highlightedIndex === index}
                  selected={selected}
                  onPointerEnter={() => setHighlightedIndex(index)}
                  onSelect={() => handleSelect(option)}
                >
                  {props.multiple ? (
                    <CheckboxOption label={option.label} selected={selected} />
                  ) : (
                    option.label
                  )}
                </DropdownItem>
              );
            })}
          </DropdownList>
        ) : (
          <DropdownEmpty>{emptyMessage}</DropdownEmpty>
        )}
      </DropdownContent>

      <ErrorList messages={errorMessages} errorId={errorId} />
    </div>
  );
}

export function Select<TValue = string>(props: SelectProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown open={isOpen} onOpenChange={setIsOpen} matchTriggerWidth clickToToggle>
      <SelectInner {...props} />
    </Dropdown>
  );
}