import { type RefObject, useEffect, useState } from "react";
import {
  AutocompleteField,
  type AutocompleteItem,
} from "@/components/shared/autocomplete";
import {
  useSetMarkerPosition,
  useSetSelectedPlace,
} from "@/store";
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
  const [searchResults, setSearchResults] = useState<PlaceGeneral[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 1200);

  useEffect(() => {
    if (debouncedSearchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    let cancelled = false;
    setIsSearchLoading(true);

    const center = mapRef.current?.getCenter();
    const params = buildGeocodeParams(debouncedSearchQuery, center);

    fetch(`/api/geocode/search?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setSearchResults(data.suggestions ?? []);
          setIsSearchLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsSearchLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearchQuery]);

  function handleSearch() {
    const query = displayValue.trim();
    if (query.length < 1) return;

    setIsSearchLoading(true);
    const center = mapRef.current?.getCenter();
    const params = buildGeocodeParams(query, center);

    fetch(`/api/geocode/search?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setSearchResults(data.suggestions ?? []);
        setIsSearchLoading(false);
      })
      .catch(() => setIsSearchLoading(false));
  }

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
        items={searchResults.map((r) => ({
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
        onClear={() => setSearchResults([])}
        onSearch={handleSearch}
      />
    </div>
  );
}
