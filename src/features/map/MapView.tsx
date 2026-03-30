"use client";

import { useEffect, useRef } from "react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import mapStyle from "@/lib/custom.json";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import { StyleSpecification } from "maplibre-gl";
import { MapControls } from "./MapControls";
import { MapPlaceInfo } from "./MapPlaceInfo";
import { useSetMarkerPosition, useSetSelectedPlace } from "@/store";
import { LatLon } from "@/lib/types/map";
import { MapMarker } from "@/features/map/MapMarker";
import { MapSearch } from "@/features/map/MapSearch";

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

  useEffect(() => {
    setMarkerPosition(initialPosition ?? null);
  }, [initialPosition, setMarkerPosition]);


  function handleMapClick(e: MapLayerMouseEvent) {
    const nextPosition = {
      lat: e.lngLat.lat,
      lon: e.lngLat.lng,
    };
    mapRef.current?.jumpTo({
      center: [nextPosition.lon, nextPosition.lat],
      zoom: 14,
    });
    setMarkerPosition(nextPosition);
    setSelectedPlace(null);

    const params = new URLSearchParams({
      lat: String(e.lngLat.lat),
      lon: String(e.lngLat.lng),
    });
    fetch(`/api/geocode/reverse?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setSelectedPlace(data);
        setMarkerPosition({
          lat: data.lat,
          lon: data.lon,
        });
        mapRef.current?.jumpTo({
          center: [data.lon, data.lat],
          zoom: 14,
        });
      })
      .catch(() => {});
  }

  function zoomIn() {
    mapRef.current?.zoomIn();
  }

  function zoomOut() {
    mapRef.current?.zoomOut();
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

      <MapControls onZoomIn={zoomIn} onZoomOut={zoomOut} />
    </div>
  );
}