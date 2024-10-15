import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { useSidebar } from "../sidebar/provider";
import Fuse from "fuse.js";

const SearchBar = () => {
  const {
    setShowSearchResults,
    setResultItems,
    items,
    showSearchResults,
    locations,
    setResultLocations,
  } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");

  const fuseOptionsForItem = {
    keys: [
      "name",
      "category",
      "brand",
      "attributes.type",
      "attributes.material",
    ],
    threshold: 0.3,
  };

  const ItemsFuse = new Fuse(items, fuseOptionsForItem);
  const LocationsFuse = new Fuse(locations, { keys: ["name"], threshold: 0.3 });

  useEffect(() => {
    if (searchTerm) {
      const itemResults = ItemsFuse.search(searchTerm).map(
        (result) => result.item,
      );
      const locationResults = LocationsFuse.search(searchTerm).map(
        (result) => result.item,
      );
      setResultItems(itemResults);
      setResultLocations(locationResults);
      setShowSearchResults(true);
    } else {
      setResultItems([]);
      setShowSearchResults(false);
    }
  }, [searchTerm, items]);

  return (
    <div className="mb-2 flex h-10 max-w-[420px] items-center rounded-2xl border-2 border-[#22343e] px-2">
      <Search size={24} className="text-gray-400" />
      <Input
        placeholder="Search Items and Locations...."
        className="border-none px-2 outline-none focus-visible:ring-0"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Handle input change
      />
      {showSearchResults && (
        <X
          size={24}
          className="cursor-pointer text-gray-400"
          onClick={() => setSearchTerm("")} // Clear the search term
        />
      )}
    </div>
  );
};

export { SearchBar };
