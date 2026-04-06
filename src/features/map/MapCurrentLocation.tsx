import { IconButton } from "@/components/shared/IconButton";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useSetMarkerPosition } from "@/store";

export function MapCurrentLocation() {
  const setMarkerPosition = useSetMarkerPosition();
  const { isLocating, locate } = useGeolocation({
    onSuccess: (nextPosition) => {
      setMarkerPosition(nextPosition);
    },
  });

  return (
    <IconButton
      icon={"Location"}
      label="Current location"
      color="secondary"
      variant="contained"
      size="m"
      onClick={locate}
      disabled={isLocating}
    />
  );
}
