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
  initiateNewLocation: (location: Location) => void;
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
  const [locations, setLocations] = useState<Location[]>(allLocations);

  useEffect(() => {
    setLocations(allLocations);
  }, [allLocations]);

  const initiateNewLocation = (location: Location) => {
    const newLocation = new Location({
      id: "new_location",
      name: "",
      parent_godown: location.id,
    });
    setLocations((prev) => [...prev, newLocation]);
    setFocusedLocation(newLocation);
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
        initiateNewLocation,
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
