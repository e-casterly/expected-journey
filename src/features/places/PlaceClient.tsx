"use client";

import { MapView } from "@/features/map/MapView";
import { PlacesList } from "@/features/places/PlacesList";

export function PlaceClient() {
  return (
    <section className="grid flex-1 grid-cols-[500px_1fr]">
      <PlacesList />
      <MapView />
    </section>
  );
}
