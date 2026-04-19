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
    <div>
      <div className="border-stroke border-b-2 px-8 py-4">
        <h1 className="text-2xl font-medium">Places</h1>
        <p>Reusable locations for trip start points and quick planning.</p>
      </div>
      <ul className="flex flex-col gap-2 px-8 py-4">
        {places.map((place) => (
          <PlaceItem key={place.id} place={place} />
        ))}
      </ul>
    </div>
  );
}
