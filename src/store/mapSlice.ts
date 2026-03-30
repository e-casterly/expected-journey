import { StateCreator } from "zustand";
import { LatLon } from "@/lib/types/map";
import { PlaceDetailed } from "@/lib/types/place";

export type MapSlice = {
  markerPosition: LatLon | null;
  setMarkerPosition: (position: LatLon | null) => void;

  selectedPlace: PlaceDetailed | null;
  setSelectedPlace: (place: PlaceDetailed | null) => void;
};

export const createMapSlice: StateCreator<MapSlice> = (set) => ({
  markerPosition: null,
  selectedPlace: null,

  setMarkerPosition: (position) => set({ markerPosition: position }),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
});
