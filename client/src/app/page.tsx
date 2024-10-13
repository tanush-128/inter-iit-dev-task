"use client";
import { DndContext } from "@dnd-kit/core";
import { Folder, Image, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ReactDragListView from "react-drag-listview";
import ItemView from "~/components/item/item";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import UserData from "~/components/userdata";
import Item from "~/models/item";
import Location from "~/models/location";

export default function HomePage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    Location.getLocations().then((locations) => setLocations(locations));
    Item.getItems().then((items) => setItems(items));
  }, []);

  return (
    <div className="flex h-screen gap-12 px-12 pb-2 pt-8">
      <div className="flex h-full w-[480px] flex-col">
        <div
          className="h-full overflow-y-auto rounded-3xl bg-secondary p-1 shadow-lg"
          id="scrollbar1"
        >
          <LocationList
            allLocations={locations}
            locations={locations.filter((loc) => loc.parent_godown == null)}
            items={items}
            setSelectedItem={setSelectedItem}
          />
        </div>
        <UserData />
      </div>
      <div
        className="flex h-full w-full flex-col overflow-y-auto"
        id="scrollbar1"
      >
        <div className="flex w-full justify-between pb-2">
          <div className="text-4xl font-extrabold">
            {selectedItem ? "Edit Item" : "Add Item"}
          </div>
          <div
            className="flex items-center rounded-2xl border-[#22343e] p-1 hover:border-2"
            onClick={() => {
              setSelectedItem(null);
            }}
          >
            <Plus size={24} className="p-1" />
            Add New Item
          </div>
        </div>
        <ItemView
          item={selectedItem ?? undefined}
          allItems={items}
          onChange={(i) => {
            Item.updateItem(i).then((updatedItem) => {
              setItems((items) =>
                items.map((item) =>
                  item.item_id === updatedItem.item_id ? updatedItem : item,
                ),
              );
            });
          }}
          locations={locations}
        />
      </div>
    </div>
  );
}

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
            <AccordionTrigger>
              <div className="flex items-center">
                <Folder />
                <span className="px-2">{location.name}</span>
              </div>
            </AccordionTrigger>
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
  // const { isOver, setNodeRef } = useDroppable({
  //   id: "droppable" + location.id,
  // });

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
