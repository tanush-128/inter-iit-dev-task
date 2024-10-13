import { createContext, use, useContext, useEffect, useState } from "react";
import Item from "~/models/item";
import Location from "~/models/location";

interface SidebarContextType {
  focusedItem: Item | null;
  foucusedLocation: Location | null;
  setFocusedItem: (item: Item | null) => void;
  setFocusedLocation: (location: Location | null) => void;
  updateLocationName: (location: Location, name: string) => Promise<void>;
  locations: Location[];
}

const SidebarContext = createContext<SidebarContextType | null>(null);

const SidebarProvider = ({
  children,
  allLocations,
}: {
  children: React.ReactNode;

  allLocations: Location[];
}) => {
  const [focusedItem, setFocusedItem] = useState<Item | null>(null);
  const [foucusedLocation, setFocusedLocation] = useState<Location | null>(
    null,
  );
  const updateLocationName = async (location: Location, name: string) => {
    const updatedLocation = { ...location, name };
    await Location.update(updatedLocation);
    setLocations((prev) => {
      const index = prev.findIndex((l) => l.id === location.id);
      const newLocations = [...prev];
      newLocations[index] = updatedLocation;
      return newLocations;
    });
  };
  const [locations, setLocations] = useState<Location[]>(allLocations);

  useEffect(() => {
    setLocations(allLocations);
  }, [allLocations]);

  return (
    <SidebarContext.Provider
      value={{
        focusedItem,
        foucusedLocation,
        setFocusedItem,
        setFocusedLocation,
        updateLocationName,
        locations,
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
