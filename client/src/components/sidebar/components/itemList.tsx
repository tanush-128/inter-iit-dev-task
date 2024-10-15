import { Filter, Image } from "lucide-react";
import Item from "~/models/item";
import Location from "~/models/location";
import { SearchBar } from "../../search/searchBar";
import { useSidebar } from "../provider";
import { LocationList } from "./locationList";
import { TypeFilterMenu } from "./typeFilterMenu";
import { useState } from "react";
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
        <Image size={36} />
      )}
      <span className="ml-2">{item.name}</span>
    </div>
  );
};

export { ItemsList, ItemListElement };
