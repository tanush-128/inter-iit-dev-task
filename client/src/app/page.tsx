"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Menu, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [openSidebar, setOpenSidebar] = useState(false);
  const sideBar = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sideBar.current &&
        !sideBar.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setOpenSidebar(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen gap-12 px-3 pb-2 pt-4 md:px-8">
      <div
        className={
          "absolute flex h-full flex-col transition-all md:visible md:relative md:left-0 md:w-[480px]" +
          (openSidebar ? "" : " -left-full")
        }
        ref={sideBar}
      >
        <SidebarProvider>
          <Sidebar setSelectedItem={setSelectedItem} />
        </SidebarProvider>
        <UserData />
      </div>
      <div
        className="flex h-full w-full flex-col overflow-y-auto"
        id="scrollbar1"
      >
        <div className="flex w-full items-center justify-between pb-2 pr-2">
          <div
            className="text-2xl md:hidden"
            ref={menuButtonRef}
            onClick={(e) => {
              // e.stopPropagation();
              setOpenSidebar(true);
            }}
          >
            <Menu size={24} />
          </div>
          <div className="text-2xl font-extrabold md:text-4xl">
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
