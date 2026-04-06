import {
  AutocompleteField,
  type AutocompleteItem,
} from "@/components/shared/autocomplete";
import React, { useEffect, useRef, useState } from "react";
import {
  useSetMarkerPosition,
  useSetSelectedPlace,
} from "@/store";
import { PlaceGeneral } from "@/lib/types/place";
import { MapRef } from "react-map-gl/maplibre";

type MapSearchProps = {
  mapRef: React.RefObject<MapRef | null>;
};

export function MapSearch({ mapRef }: MapSearchProps) {
  const setSelectedPlace = useSetSelectedPlace();
  const setMarkerPosition = useSetMarkerPosition();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceGeneral[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 1200);
    return () => window.clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    let cancelled = false;
    setIsSearchLoading(true);

    const center = mapRef.current?.getCenter();
    const params = new URLSearchParams({ q: debouncedSearchQuery });
    if (center) {
      params.set("lat", String(center.lat));
      params.set("lon", String(center.lng));
    }
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
    const query = searchQuery.trim();
    if (query.length < 1) return;

    setIsSearchLoading(true);
    const params = new URLSearchParams({ q: query });
    const center = mapRef.current?.getCenter();
    if (center) {
      params.set("lat", String(center.lat));
      params.set("lon", String(center.lng));
    }
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
    const nextPosition = { lat: result.lat, lon: result.lon };
    setMarkerPosition(nextPosition);

    skipNextSearchRef.current = true;
    setSearchQuery(item.label);
    setSelectedPlace(result);

    const params = new URLSearchParams({
      osm_type: result.osmType,
      osm_id: String(result.osmId),
    });
    fetch(`/api/geocode/lookup?${params}`)
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        setSelectedPlace(data);
      })
      .catch(() => {});
  }

  return (
    <div className="absolute top-3 left-3 z-10 w-sm">
      <AutocompleteField
        placeholder="Search location..."
        value={searchQuery}
        items={searchResults.map((r) => ({
          id: r.id,
          label: r.name,
          description: r.address,
          value: r,
        }))}
        isLoading={isSearchLoading}
        emptyMessage="Type at least 3 characters"
        noResultsMessage="No results found"
        onQueryChange={(value) => setSearchQuery(value)}
        onSelect={handleSearchSelect}
        onClear={() => {
          setSearchResults([]);
        }}
        onSearch={handleSearch}
      />
    </div>
  );
}