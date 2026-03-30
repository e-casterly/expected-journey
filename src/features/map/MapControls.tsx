import { Button } from "@/components/shared/Button";
import { ButtonGroup } from "@/components/shared/ButtonGroup";
import { Icon } from "@/components/shared/Icon";
import { MapCurrentLocation } from "@/features/map/MapCurrentLocation";

type MapControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function MapControls({ onZoomIn, onZoomOut }: MapControlsProps) {
  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-3">
      <MapCurrentLocation />
      <ButtonGroup orientation="vertical">
        <Button onClick={onZoomIn} aria-label="Zoom in" variant="icon" color="secondary">
          <Icon icon="Plus" size="s" />
        </Button>
        <Button onClick={onZoomOut} aria-label="Zoom out" variant="icon" color="secondary">
          <Icon icon="Minus" size="s" />
        </Button>
      </ButtonGroup>
    </div>
  );
}