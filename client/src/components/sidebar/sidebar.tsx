"use client";
import { Filter, Folder, Image, Sidebar, Type } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import Item from "~/models/item";
import Location from "~/models/location";
import { ContextMenuDemo } from "../menu";
import { SidebarProvider, useSidebar } from "./provider";
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
  } = useSidebar();
  return (
    <div className="relative h-full">
      <div
        className="relative h-full overflow-y-auto overflow-x-hidden rounded-3xl bg-secondary shadow-lg"
        id="scrollbar1"
      >
        {/* Sticky Header with Search and Filter Button */}
        <div className="sticky top-0 z-10 flex bg-secondary px-3 pb-1 pt-3">
          <SearchBar />
          <div className="relative">
            <button
              className="ml-2 rounded-lg bg-blue-600 bg-primary px-2 py-2 text-white"
              onClick={() => {
                setShowFilterMenu(!showFilterMenu);
              }}
            >
              <Filter size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        {showSearchResults ? (
          <div>
            {resultItems.map((item) => (
              <ItemListElement
                item={item}
                setSelectedItem={setSelectedItem}
                key={item.item_id}
              />
            ))}
          </div>
        ) : (
          <LocationList
            allLocations={locations}
            locations={locations.filter((loc) => loc.parent_godown == null)}
            items={items}
            setSelectedItem={setSelectedItem}
          />
        )}

        {/* Filter Menu Rendered Outside Scrollable Box */}
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
  return (
    <Accordion type="multiple" className={className}>
      {locations.map((location, index) => {
        return (
          <AccordionItem key={location.id} value={location.id} className="px-2">
            <ContextMenuDemo location={location}>
              <AccordionTrigger>
                <LocationElement location={location} />
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
                />
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

import { useRef, useEffect } from "react";
import { SearchBar } from "../search/searchBar";
import { TypeFilterMenu } from "./typeFilterMenu";

const LocationElement = ({ location }: { location: Location }) => {
  const { foucusedLocation, setFocusedLocation, updateLocationName } =
    useSidebar(); // Assuming updateLocationName updates the location name
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input when focusedLocation matches the current location
    if (foucusedLocation?.id === location.id && inputRef.current) {
      inputRef.current.focus(); // This ensures the cursor is in the input field
    }
  }, [foucusedLocation, location.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        // Action when clicking outside the input, e.g., remove focus
        setFocusedLocation(null); // Or any other action you want to perform
      }
    };

    // Add the event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setFocusedLocation]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Action when pressing Enter, e.g., saving the new location name
      updateLocationName(location, inputRef.current?.value || location.name);
      setFocusedLocation(null); // Remove focus after saving
    }
  };

  return (
    <div className="flex items-center">
      <Folder />
      <span className="px-2">
        {foucusedLocation?.id === location.id ? (
          <input
            ref={inputRef} // Attach the ref here
            type="text"
            defaultValue={location.name} // Use defaultValue to prevent making it controlled
            className="border border-primary bg-transparent px-1"
            onKeyDown={handleKeyDown} // Capture Enter key
          />
        ) : (
          location.name
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
}: {
  items: Item[];
  location: Location;
  setSelectedItem: (item: Item) => void;
  index: number;
}) => {
  return (
    <div className="px-4 py-2">
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
  return (
    <div
      className="draggable-item flex items-center rounded-lg p-2 hover:bg-background"
      key={item.item_id}
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
