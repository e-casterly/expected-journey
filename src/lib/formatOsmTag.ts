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
      return part.trim().replace(/_/g, " ");
    })
    .join(", ");
}