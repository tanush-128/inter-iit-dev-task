import { createContext, useContext, useEffect, useState } from "react";
import Item from "~/models/item";
import Location from "~/models/location";
import { useData } from "~/providers/dataProvider";

interface SidebarContextType {
  focusedItem: Item | null;
  foucusedLocation: Location | null;
  setFocusedItem: (item: Item | null) => void;
  setFocusedLocation: (location: Location | null) => void;
  updateLocationName: (location: Location, name: string) => Promise<void>;
  locations: Location[];
  items: Item[];
  setItems: (items: Item[]) => void;
  initiateNewLocation: (location: Location) => void;
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
  resultItems: Item[];
  setResultItems: (items: Item[]) => void;
  resultLocations: Location[];
  setResultLocations: (locations: Location[]) => void;
  showFilterMenu: boolean;
  setShowFilterMenu: (show: boolean) => void;

  moveItemToLocation: (item: Item, newLocation: Location) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [focusedItem, setFocusedItem] = useState<Item | null>(null);
  const [foucusedLocation, setFocusedLocation] = useState<Location | null>(
    null,
  );

  const updateLocationName = async (location: Location, name: string) => {
    if (location.id === "new_location") {
      const loc = await Location.create({
        ...location,
        name,
      });

      setLocations((prev) => {
        const index = prev.findIndex((l) => l.id === location.id);
        const newLocations = [...prev];
        newLocations[index] = loc;
        return newLocations;
      });
      return;
    }
    const updatedLocation = { ...location, name };
    await Location.update(updatedLocation);
    setLocations((prev) => {
      const index = prev.findIndex((l) => l.id === location.id);
      const newLocations = [...prev];
      newLocations[index] = updatedLocation;
      return newLocations;
    });
  };
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [resultItems, setResultItems] = useState<Item[]>([]);
  const [resultLocations, setResultLocations] = useState<Location[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const { locations, items: dataItems, setLocations } = useData();

  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    setItems(dataItems);
  }, [dataItems]);

  const initiateNewLocation = (location: Location) => {
    const newLocation = new Location({
      id: "new_location",
      name: "",
      parent_godown: location.id,
    });
    setLocations((prev) => [...prev, newLocation]);
    setFocusedLocation(newLocation);
  };
  const moveItemToLocation = (item: Item, newLocation: Location) => {
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.item_id === item.item_id ? { ...i, godown_id: newLocation.id } : i,
      ),
    );
  };

  return (
    <SidebarContext.Provider
      value={{
        focusedItem,
        foucusedLocation,
        setFocusedItem,
        setFocusedLocation,
        updateLocationName,
        locations,
        items,
        setItems,
        resultLocations,
        setResultLocations,
        initiateNewLocation,
        showSearchResults,
        setShowSearchResults,
        resultItems,
        setResultItems,

        showFilterMenu,
        setShowFilterMenu,
        moveItemToLocation,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export { SidebarProvider, useSidebar };
