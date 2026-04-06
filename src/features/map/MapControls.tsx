import { ButtonGroup } from "@/components/shared/ButtonGroup";
import { MapCurrentLocation } from "@/features/map/MapCurrentLocation";
import { IconButton } from "@/components/shared/IconButton";

type MapControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function MapControls({ onZoomIn, onZoomOut }: MapControlsProps) {
  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-3">
      <MapCurrentLocation />
      <ButtonGroup orientation="vertical">
        <IconButton
          onClick={onZoomIn}
          label="Zoom in"
          color="secondary"
          variant="contained"
          icon="Plus"
          size="m"
        />
        <IconButton
          onClick={onZoomOut}
          label="Zoom out"
          color="secondary"
          variant="contained"
          icon="Minus"
          size="m"
        />
      </ButtonGroup>
    </div>
  );
}