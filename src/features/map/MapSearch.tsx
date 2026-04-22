import { type RefObject, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AutocompleteField,
  type AutocompleteItem,
} from "@/components/shared/autocomplete";
import { useSetMarkerPosition, useSetSelectedPlace } from "@/store";
import { PlaceGeneral } from "@/lib/types/place";
import { MapRef } from "react-map-gl/maplibre";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";

type MapSearchProps = {
  mapRef: RefObject<MapRef | null>;
};

function buildGeocodeParams(query: string, center?: { lat: number; lng: number }) {
  const params = new URLSearchParams({ q: query });
  if (center) {
    params.set("lat", String(center.lat));
    params.set("lon", String(center.lng));
  }
  return params;
}

export function MapSearch({ mapRef }: MapSearchProps) {
  const setSelectedPlace = useSetSelectedPlace();
  const setMarkerPosition = useSetMarkerPosition();

  const [displayValue, setDisplayValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, flushSearchQuery] = useDebouncedValue(searchQuery, 1200);

  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ["geocode-search", debouncedSearchQuery],
    queryFn: async () => {
      const center = mapRef.current?.getCenter();
      const params = buildGeocodeParams(debouncedSearchQuery, center);
      const r = await fetch(`/api/geocode/search?${params}`);
      const data = await r.json();
      return (data.suggestions ?? []) as PlaceGeneral[];
    },
    enabled: debouncedSearchQuery.length >= 3,
    staleTime: 30_000,
  });

  // Show spinner while the user is still typing (debounce pending) or fetch is in flight
  const isSearchLoading =
    (searchQuery.length >= 3 && searchQuery !== debouncedSearchQuery) || isFetching;

  // Hide stale results while the query is being cleared (before debounce fires)
  const visibleResults = searchQuery.length >= 3 ? searchResults : [];

  function handleSearchSelect(item: AutocompleteItem<PlaceGeneral>) {
    const result = item.value;
    setMarkerPosition({ lat: result.lat, lon: result.lon });
    setDisplayValue(item.label);
    setSelectedPlace(result);
  }

  return (
    <div className="absolute top-3 left-3 z-10 w-sm">
      <AutocompleteField
        placeholder="Search location..."
        value={displayValue}
        items={visibleResults.map((r) => ({
          id: r.id,
          label: r.name,
          description: r.address,
          value: r,
        }))}
        isLoading={isSearchLoading}
        emptyMessage="Type at least 3 characters"
        noResultsMessage="No results found"
        onQueryChange={(value) => {
          setDisplayValue(value);
          setSearchQuery(value);
        }}
        onSelect={handleSearchSelect}
        onClear={() => {}}
        onSearch={flushSearchQuery}
      />
    </div>
  );
}
