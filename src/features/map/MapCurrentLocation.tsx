import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/shared/Button";
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
    <Button
      onClick={locate}
      disabled={isLocating}
      variant="icon"
      color="secondary"
    >
      <Icon icon="Location" size="s" />
    </Button>
  );
}