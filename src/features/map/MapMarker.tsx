import { Marker } from "react-map-gl/maplibre";
import { useMarkerPosition } from "@/store";

export function MapMarker() {
  const markerPosition = useMarkerPosition();

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