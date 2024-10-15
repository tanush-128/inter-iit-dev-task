import { useEffect, useState } from "react";
import { useSidebar } from "../provider";
import { useData } from "~/providers/dataProvider";
import { X } from "lucide-react";

const TypeFilterMenu = () => {
  const { items, setItems, setShowFilterMenu } = useSidebar();
  const { items: dataItems } = useData();
  const [types, setTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    const types = dataItems.map((item) => item.category);
    setTypes([...new Set(types)]);
  }, [dataItems]);

  useEffect(() => {
    if (selectedTypes.length === 0) {
      setItems(dataItems);
      //   setSelectedTypes(dataItems.map((item) => item.category));
    } else {
      setItems(
        dataItems.filter((item) => selectedTypes.includes(item.category)),
      );
    }
  }, [selectedTypes, dataItems, setItems]);

  //   useEffect(() => {
  //     setSelectedTypes(items.map((item) => item.category));
  //   }, [items]);

  return (
    <div className="z-30 w-64 rounded-lg bg-white p-4 text-gray-900 shadow-2xl">
      <div className="mb-3 flex items-center justify-between text-lg font-bold text-gray-800">
        <span>Filter by Type</span>
        <X
          size={24}
          className="cursor-pointer text-gray-400"
          onClick={() => setShowFilterMenu(false)}
        />
      </div>
      <div className="flex flex-col gap-3">
        {types.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={type}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
              checked={selectedTypes.includes(type)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedTypes([...selectedTypes, type]);
                } else {
                  setSelectedTypes(selectedTypes.filter((t) => t !== type));
                }
              }}
            />
            <label
              htmlFor={type}
              className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-primary"
            >
              {type}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-300"
          onClick={() => setSelectedTypes([])}
        >
          Clear
        </button>
        <button className="hover:bg-primary-dark rounded-md bg-primary px-4 py-2 text-sm text-white transition-colors">
          Apply
        </button>
      </div>
    </div>
  );
};

export { TypeFilterMenu };
