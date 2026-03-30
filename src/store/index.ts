import { create } from "zustand";
import { createMapSlice, type MapSlice } from "./mapSlice";

type StoreState = MapSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createMapSlice(...a),
}));

export const useMarkerPosition = () => useStore((s) => s.markerPosition);
export const useSetMarkerPosition = () => useStore((s) => s.setMarkerPosition);

export const useSelectedPlace = () => useStore((s) => s.selectedPlace);
export const useSetSelectedPlace = () => useStore((s) => s.setSelectedPlace);