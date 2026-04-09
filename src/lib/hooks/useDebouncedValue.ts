import { useCallback, useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number): [T, () => void] {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const latestValueRef = useRef(value);

  // Keep ref in sync outside of render so flush() always reads the latest value
  useEffect(() => {
    latestValueRef.current = value;
  });

  useEffect(() => {
    const id = window.setTimeout(
      () => setDebouncedValue(latestValueRef.current),
      delay,
    );
    return () => window.clearTimeout(id);
  }, [value, delay]);

  // Immediately apply the current value, bypassing the remaining delay
  const flush = useCallback(() => {
    setDebouncedValue(latestValueRef.current);
  }, []);

  return [debouncedValue, flush];
}
