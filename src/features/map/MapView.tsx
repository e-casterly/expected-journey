"use client";

import { useEffect, useRef } from "react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import mapStyle from "@/lib/custom.json";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import { StyleSpecification } from "maplibre-gl";
import { useMutation } from "@tanstack/react-query";
import { MapControls } from "./MapControls";
import { MapPlaceInfo } from "./MapPlaceInfo";
import { useSetMarkerPosition, useSetSelectedPlace } from "@/store";
import { LatLon } from "@/lib/types/map";
import { PlaceGeneral } from "@/lib/types/place";
import { MapMarker } from "@/features/map/MapMarker";
import { MapSearch } from "@/features/map/MapSearch";
import { useMapFocus } from "@/features/map/useMapFocus";

export const DEFAULT_MAP_POSITION: LatLon = {
  lat: 43.539257,
  lon: -5.658216,
};

type MapViewProps = {
  initialPosition?: LatLon;
};

export function MapView({
  initialPosition
}: MapViewProps) {
  const mapRef = useRef<MapRef | null>(null);
  const setMarkerPosition = useSetMarkerPosition();
  const setSelectedPlace = useSetSelectedPlace();

  useMapFocus(mapRef);

  useEffect(() => {
    setMarkerPosition(initialPosition ?? null);
  }, [initialPosition, setMarkerPosition]);

  const { mutate: reverseGeocode } = useMutation({
    mutationFn: async (coords: LatLon) => {
      const { lat, lon } = coords;
      const params = new URLSearchParams({ lat: String(lat), lon: String(lon) });
      const r = await fetch(`/api/geocode/reverse?${params}`);
      if (r.status === 204) return null;
      return r.json() as Promise<PlaceGeneral>;
    },
    onSuccess: (data) => {
      if (!data) return;
      setSelectedPlace(data);
      setMarkerPosition({ lat: data.lat, lon: data.lon });
    },
  });

  function handleMapClick(e: MapLayerMouseEvent) {
    const nextPosition = { lat: e.lngLat.lat, lon: e.lngLat.lng };
    setMarkerPosition(nextPosition);
    setSelectedPlace(null);
    reverseGeocode(nextPosition);
  }

  const viewCenter = initialPosition ?? DEFAULT_MAP_POSITION;

  return (
    <div className="relative flex-1">
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: viewCenter.lat,
          longitude: viewCenter.lon,
          zoom: 14,
        }}
        mapStyle={mapStyle as StyleSpecification}
        style={{ width: "100%", height: "100%" }}
        onClick={handleMapClick}
      >
        <MapMarker />
      </Map>

      <MapSearch mapRef={mapRef} />
      <MapPlaceInfo />

      <MapControls
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
      />
    </div>
  );
}