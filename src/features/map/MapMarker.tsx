import { MapRef, Marker } from "react-map-gl/maplibre";
import { useMarkerPosition } from "@/store";
import React, { useEffect } from "react";

type MapMarkerProps = {
  mapRef: React.RefObject<MapRef | null>;
};

export function MapMarker({ mapRef }: MapMarkerProps) {
  const markerPosition = useMarkerPosition();

  useEffect(() => {
    if (markerPosition?.lat && markerPosition?.lon) {
      mapRef.current?.jumpTo({
        center: [markerPosition.lon, markerPosition.lat],
        zoom: 14,
      });
    }
  }, [markerPosition?.lat, markerPosition?.lon]);

  if (!markerPosition) {
    return null;
  }
  return (
    <Marker
      color="red"
      latitude={markerPosition.lat}
      longitude={markerPosition.lon}
    />
  );
}