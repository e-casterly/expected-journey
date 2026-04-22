"use client";

import { MapView } from "@/features/map/MapView";
import { TripCreateForm } from "@/features/trips/create/TripCreateForm";

export function TripCreateClient () {
  return (
    <>
      <TripCreateForm />
      <MapView />
    </>
  );
}