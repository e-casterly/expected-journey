import { useEffect, type RefObject } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { useMarkerPosition } from "@/store";

/**
 * Pans and zooms the map to the current marker position whenever it changes.
 * Lives in MapView where mapRef is owned — not in MapMarker which only renders.
 */
export function useMapFocus(mapRef: RefObject<MapRef | null>) {
  const markerPosition = useMarkerPosition();

  useEffect(() => {
    if (markerPosition) {
      mapRef.current?.jumpTo({
        center: [markerPosition.lon, markerPosition.lat],
        zoom: 14,
      });
    }
    // mapRef is a stable RefObject — its identity never changes,
    // so including it in deps would be noise without any functional difference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerPosition?.lat, markerPosition?.lon]);
}
