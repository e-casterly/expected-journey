/**
 * Formats a raw OSM tag value into a human-readable string.
 * Handles semicolon-separated lists and underscores.
 *
 * Examples:
 *   "coffee_shop"            → "Coffee shop"
 *   "breakfast;coffee_shop"  → "Breakfast, Coffee shop"
 */
export function formatOsmTag(value: string): string {
  return value
    .split(";")
    .map((part) => {
      const trimmed = part.trim().replace(/_/g, " ");
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    })
    .join(", ");
}