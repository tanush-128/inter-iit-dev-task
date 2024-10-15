"use client";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import Item from "~/models/item";
import Location from "~/models/location";
import { ContextMenuDemo } from "../../menu";
import { ItemsList } from "./itemList";
import { LocationElement } from "./locationListElement";

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

export { LocationList };
