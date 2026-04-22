"use client";

import { useQuery } from "@tanstack/react-query";
import type { PlaceDto, PlacesResponse } from "@/lib/api/places";
import { PlaceItem } from "@/features/places/PlaceItem";

function usePlaces() {
  return useQuery<PlaceDto[]>({
    queryKey: ["places"],
    queryFn: () =>
      fetch("/api/places")
        .then((r) => r.json())
        .then((data: PlacesResponse) => data.places),
  });
}

export function PlacesList() {
  const { data: places = [] } = usePlaces();
  console.log(places);
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-stroke border-b-2 px-8 py-4">
        <h1 className="text-2xl font-medium">Places</h1>
        <p>Reusable locations for trip start points and quick planning.</p>
      </div>
      <div className="h-full w-full overflow-hidden">
        <div className="overflow-auto flex flex-col h-full w-full">
          <ul className="flex flex-col gap-2 px-8 py-4">
            {places.map((place) => (
              <PlaceItem key={place.id} place={place} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
