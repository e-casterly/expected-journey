import { useState } from "react";
import { LatLon } from "@/lib/types/map";

type UseGeolocationOptions = {
  onSuccess: (position: LatLon) => void;
  onError?: () => void;
};

export function useGeolocation({ onSuccess, onError }: UseGeolocationOptions) {
  const [isLocating, setIsLocating] = useState(false);

  function locate() {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nextPosition: LatLon = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setIsLocating(false);
        onSuccess(nextPosition);
      },
      () => {
        setIsLocating(false);
        onError?.();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  return { isLocating, locate };
}