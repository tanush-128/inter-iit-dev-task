"use client";
import { Filter } from "lucide-react";
import Item from "~/models/item";
import { SearchBar } from "../search/searchBar";
import { ItemListElement } from "./components/itemList";
import { LocationList } from "./components/locationList";
import { useSidebar } from "./provider";
import { TypeFilterMenu } from "./components/typeFilterMenu";
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
              className="ml-2 rounded-lg bg-[#1b48ed] px-2 py-2 text-white"
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
