"use client";

import { MapView } from "@/features/map/MapView";
import { PlacesList } from "@/features/places/PlacesList";

export function PlaceClient() {
  return (
    <>
      <PlacesList />
      <MapView />
    </>
  );
}
