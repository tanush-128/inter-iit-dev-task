"use client";
import { DndContext } from "@dnd-kit/core";
import { Folder, Image, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ReactDragListView from "react-drag-listview";
import ItemView from "~/components/item/item";
import { SidebarProvider } from "~/components/sidebar/provider";
import { Sidebar } from "~/components/sidebar/sidebar";
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
        <SidebarProvider allLocations={locations}>
          <Sidebar
            // locations={locations}
            items={items}
            setSelectedItem={setSelectedItem}
          />
        </SidebarProvider>
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
