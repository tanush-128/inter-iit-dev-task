import { useEffect, useRef, useState } from "react";

import { Folder } from "lucide-react";
import Location from "~/models/location";
import { useSidebar } from "../provider";

const LocationElement = ({
  location,
  allLocations,
  onExpand,

  onClose,
}: {
  location: Location;
  allLocations: Location[];
  onExpand: () => void;
  onClose: () => void;
}) => {
  const {
    foucusedLocation,
    setFocusedLocation,
    updateLocationName,
    moveItemToLocation,
  } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false); // Track drag state

  const isParentLocation = allLocations.some(
    (loc) => loc.parent_godown === location.id,
  );

  useEffect(() => {
    if (foucusedLocation?.id === location.id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [foucusedLocation, location.id]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isParentLocation) {
      event.preventDefault();
      setIsDragOver(true);
    }
    // onExpand();
    setTimeout(() => {
      if (!isDragOver) onExpand();
    }, 400);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isParentLocation) {
      const droppedItem = JSON.parse(event.dataTransfer.getData("text/plain"));
      moveItemToLocation(droppedItem, location);
      setIsDragOver(false); // Reset drag state
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
    onClose();
  };

  return (
    <div
      className={`flex w-full items-center p-2 ${
        isDragOver ? "bg-slate-800" : ""
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave} // Handle drag leave
    >
      <Folder />
      <span className="px-2">
        {foucusedLocation?.id === location.id ? (
          <input
            ref={inputRef}
            type="text"
            defaultValue={location.name}
            className="border border-primary bg-transparent px-1"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateLocationName(
                  location,
                  inputRef.current?.value || location.name,
                );
                setFocusedLocation(null);
              }
            }}
          />
        ) : (
          <span className="line-clamp-1 text-left">{location.name}</span>
        )}
      </span>
    </div>
  );
};

export { LocationElement };
