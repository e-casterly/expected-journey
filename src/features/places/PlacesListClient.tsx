"use client";

import { useQuery } from "@tanstack/react-query";
import { MapView } from "@/features/map/MapView";
import type { PlaceDto, PlacesResponse } from "@/lib/api/places";
import { PlaceListItem } from "@/features/places/PlaceListItem";

function usePlaces() {
  return useQuery<PlaceDto[]>({
    queryKey: ["places"],
    queryFn: () =>
      fetch("/api/places")
        .then((r) => r.json())
        .then((data: PlacesResponse) => data.places),
  });
}

export function PlacesListClient() {
  const { data: places = [] } = usePlaces();

  return (
    <section className="grid flex-1 grid-cols-[600px_1fr]">
      <div className="px-8 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Places</h1>
            <p>Reusable locations for trip start points and quick planning.</p>
          </div>
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {places.map((place) => (
            <PlaceListItem key={place.id} place={place} />
          ))}
        </ul>
      </div>
      <MapView />
    </section>
  );
}
