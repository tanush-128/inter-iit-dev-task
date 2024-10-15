"use client";
import { Filter, Folder, Image } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import Item from "~/models/item";
import Location from "~/models/location";
import { ContextMenuDemo } from "../menu";
import { useSidebar } from "./provider";
const LocationsSidebar = ({
  setSelectedItem,
}: {
  setSelectedItem: (item: Item | null) => void;
}) => {
  const {
    locations,
    showSearchResults,
    resultItems,
    items,
    setShowFilterMenu,
    showFilterMenu,
    resultLocations,
  } = useSidebar();
  return (
    <div className="relative h-full">
      <div
        className="relative h-full overflow-y-auto overflow-x-hidden rounded-3xl bg-secondary shadow-lg"
        id="scrollbar1"
      >
        <div className="sticky top-0 z-10 flex bg-secondary px-3 pb-1 pt-3">
          <SearchBar />
          <div className="relative">
            <div
              className="ml-2 rounded-lg bg-blue-600 px-2 py-2 text-white"
              onClick={() => {
                setShowFilterMenu(!showFilterMenu);
              }}
            >
              <Filter size={24} />
            </div>
          </div>
        </div>

        {showSearchResults ? (
          <div>
            <div>
              {resultItems.map((item) => (
                <ItemListElement
                  item={item}
                  setSelectedItem={setSelectedItem}
                  key={item.item_id}
                />
              ))}
            </div>
            <div>
              <LocationList
                allLocations={locations}
                locations={resultLocations}
                items={items}
                setSelectedItem={setSelectedItem}
              />
            </div>
          </div>
        ) : (
          <LocationList
            allLocations={locations}
            locations={locations.filter((loc) => loc.parent_godown == null)}
            items={items}
            setSelectedItem={setSelectedItem}
          />
        )}
      </div>
      {showFilterMenu && (
        <div className="absolute -right-[60%] top-10 z-50">
          <TypeFilterMenu />
        </div>
      )}
    </div>
  );
};

export { LocationsSidebar as Sidebar };
const LocationList = ({
  locations,
  allLocations,
  items,
  className,
  setSelectedItem,
}: {
  locations: Location[];
  allLocations: Location[];
  items: Item[];
  className?: string;
  setSelectedItem: (item: Item) => void;
}) => {
  const [expandedLocationId, setExpandedLocationId] = useState<string | null>(
    null,
  );
  const [expandedLocations, setExpandedLocations] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleExpand = (locationId: string) => {
    setExpandedLocationId(locationId);
  };

  useEffect(() => {
    if (expandedLocationId) {
      setExpandedLocations((prev) => [...prev, expandedLocationId]);
    }
  }, [expandedLocationId]);

  // Function to handle scrolling while dragging
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const { clientHeight, scrollTop, scrollHeight } = scrollContainer;
      const threshold = 50; // Threshold distance from the top/bottom to trigger scrolling
      const dragPosition = event.clientY;

      if (dragPosition < threshold) {
        // If dragging near the top, scroll up
        scrollContainer.scrollTop = Math.max(0, scrollTop - 10);
      } else if (dragPosition > clientHeight - threshold) {
        // If dragging near the bottom, scroll down
        scrollContainer.scrollTop = Math.min(scrollHeight, scrollTop + 10);
      }
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className={`relative overflow-y-auto ${className}`}
      onDragOver={handleDragOver}
    >
      <Accordion
        type="multiple"
        value={expandedLocations}
        onValueChange={(value) => setExpandedLocations(value)}
      >
        {locations.map((location, index) => {
          const closeLoc = (location: Location) => {
            setTimeout(() => {
              if (
                allLocations.find(
                  (loc) => loc.parent_godown === expandedLocationId,
                )?.parent_godown === location.id
              ) {
                return;
              }
              if (expandedLocationId === location.id) {
                return;
              }
              setExpandedLocationId(null);
              setExpandedLocations((prev) =>
                prev.filter((loc) => loc !== location.id),
              );
            }, 1000);
          };

          return (
            <AccordionItem
              key={location.id}
              value={location.id}
              className="px-2"
            >
              <ContextMenuDemo location={location}>
                <AccordionTrigger className="p-2">
                  <LocationElement
                    location={location}
                    allLocations={allLocations}
                    onExpand={() => handleExpand(location.id)} // Pass expand handler
                    onClose={() => {
                      closeLoc(location);
                    }}
                  />
                </AccordionTrigger>
              </ContextMenuDemo>
              <AccordionContent className="ml-4">
                {allLocations.filter((l) => l.parent_godown == location.id)
                  .length > 0 ? (
                  <LocationList
                    locations={allLocations.filter(
                      (l) => l.parent_godown == location.id,
                    )}
                    items={items}
                    allLocations={allLocations}
                    setSelectedItem={setSelectedItem}
                    className="draggable"
                  />
                ) : (
                  <ItemsList
                    items={items}
                    location={location}
                    setSelectedItem={setSelectedItem}
                    index={index}
                    onExpand={() => handleExpand(location.id)}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

import { useEffect, useRef, useState } from "react";
import { SearchBar } from "../search/searchBar";
import { TypeFilterMenu } from "./typeFilterMenu";

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

const ItemsList = ({
  items,
  location,
  setSelectedItem,
  index,
  onExpand,
}: {
  items: Item[];
  location: Location;
  setSelectedItem: (item: Item) => void;
  index: number;
  onExpand: () => void;
}) => {
  const { moveItemToLocation } = useSidebar();
  const [isDragOver, setIsDragOver] = useState(false);
  let dragOverTimeout: NodeJS.Timeout | null = null;
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!dragOverTimeout) {
      dragOverTimeout = setTimeout(() => {
        setIsDragOver(true);
        onExpand();
        dragOverTimeout = null; // Reset the timeout
      }, 100); // Throttle dragOver to 100ms
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const droppedItem = JSON.parse(event.dataTransfer.getData("text/plain"));
    moveItemToLocation(droppedItem, location);
    setIsDragOver(false);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
    if (dragOverTimeout) {
      clearTimeout(dragOverTimeout); // Clear the timeout if drag leaves before throttle
      dragOverTimeout = null;
    }
  };

  return (
    <div
      className={`relative px-4 py-2 transition-colors duration-150 ${
        isDragOver ? "bg-[#151e27]" : ""
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      {isDragOver && (
        <div
          className="absolute inset-0 rounded-lg opacity-50"
          style={{ pointerEvents: "none" }} // Prevents interference with drag events
        >
          <p className="text-center text-blue-600">Drop Here</p>
        </div>
      )}
      {items
        .filter((item) => item.godown_id == location.id)
        .map((item) => (
          <ItemListElement
            item={item}
            setSelectedItem={setSelectedItem}
            key={item.item_id}
          />
        ))}
    </div>
  );
};

const ItemListElement = ({
  item,
  setSelectedItem,
}: {
  item: Item;
  setSelectedItem: (item: Item) => void;
}) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(item)); // Store the item data
  };

  return (
    <div
      className="flex items-center rounded-lg p-2 hover:bg-background"
      key={item.item_id}
      draggable // Make the item draggable
      onDragStart={handleDragStart} // Handle drag start event
      onClick={() => {
        setSelectedItem(item);
      }}
    >
      {item.image_url ? (
        <img src={item.image_url} className="mr-2 h-8 w-8 rounded" />
      ) : (
        <Image />
      )}
      <span className="ml-2">{item.name}</span>
    </div>
  );
};
