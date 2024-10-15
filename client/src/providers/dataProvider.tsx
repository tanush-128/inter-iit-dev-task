import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import Item from "~/models/item";
import Location from "~/models/location";

interface Data {
  locations: Location[];
  items: Item[];
  setLocations: Dispatch<SetStateAction<Location[]>>;
  setItems: Dispatch<SetStateAction<Item[]>>;
  selectedItem: Item | null;
  setSelectedItem: Dispatch<SetStateAction<Item | null>>;
}

const DataContext = createContext<Data | null>(null);

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    Location.getLocations().then((locations) => setLocations(locations));
    Item.getItems().then((items) => setItems(items));
  }, []);

  return (
    <DataContext.Provider
      value={{
        locations,
        items,
        setLocations,
        setItems,

        selectedItem,
        setSelectedItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export { DataProvider, useData };
