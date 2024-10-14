"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import ItemView from "~/components/item/item";
import { SidebarProvider } from "~/components/sidebar/provider";
import { Sidebar } from "~/components/sidebar/sidebar";
import UserData from "~/components/userdata";
import Item from "~/models/item";
import { useData } from "~/providers/dataProvider";

export default function HomePage() {
  const { locations, items, setItems, setLocations } = useData();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const deleteItem = (item: Item) => {
    Item.deleteItem(item).then(() => {
      setItems((items) => items.filter((i) => i.item_id !== item.item_id));
    });
    setSelectedItem(null);
  };

  return (
    <div className="flex h-screen gap-12 px-8 pb-2 pt-4">
      <div className="flex h-full w-[480px] flex-col">
        <SidebarProvider>
          <Sidebar setSelectedItem={setSelectedItem} />
        </SidebarProvider>
        <UserData />
      </div>
      <div
        className="flex h-full w-full flex-col overflow-y-auto"
        id="scrollbar1"
      >
        <div className="flex w-full justify-between pb-2 pr-2">
          <div className="text-4xl font-extrabold">
            {selectedItem ? "Edit Item" : "Add Item"}
          </div>
          <div
            className="flex h-10 items-center rounded-2xl bg-[#1b48ed] p-2 hover:border-2"
            onClick={() => {
              setSelectedItem(null);
            }}
          >
            <Plus size={24} className="" />
            Add New Item
          </div>
        </div>
        <ItemView
          item={selectedItem ?? undefined}
          allItems={items}
          deleteItem={deleteItem}
          onChange={(i) => {
            if (selectedItem) {
              Item.updateItem(i).then((updatedItem) => {
                setItems((items) =>
                  items.map((item) =>
                    item.item_id === updatedItem.item_id ? updatedItem : item,
                  ),
                );
              });
            } else {
              console.log(i);
              Item.createItem(i).then((createdItem) => {
                setItems((items) => [...items, createdItem]);
                setSelectedItem(createdItem);
              });
            }
          }}
          locations={locations}
        />
      </div>
    </div>
  );
}
