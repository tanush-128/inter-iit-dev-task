import Item from "~/models/item";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "../ui/button";
import { Image, ImagePlus, Plus } from "lucide-react";
import Location from "~/models/location";
import { useEffect, useState } from "react";
import { SetLocation } from "./location";
import { useRouter } from "next/navigation";
import { NestedDraggableList } from "./test";

const ItemView = ({
  item,
  allItems,
  onChange,
  locations,
}: {
  item?: Item;
  allItems: Item[];
  onChange: (updatedItem: Item) => void;
  locations: Location[];
}) => {
  // Check if item is empty, indicating Add Item mode
  const isNewItem = !item;
  const router = useRouter();
  // Set default values for a new item
  const defaultItem: Item = {
    name: "",
    image_url: "",
    quantity: 0,
    price: 0,
    category: "",
    status: "in_stock",
    brand: "",
    attributes: {
      type: "",
      material: "",
      warranty_years: 0,
    },
    godown_id: "4ce59062eadd4d4ca5e105f30a9f7256",
    item_id: "",
  };

  const [updatedItem, setUpdatedItem] = useState(
    isNewItem ? defaultItem : item,
  );

  useEffect(() => {
    setUpdatedItem(isNewItem ? defaultItem : item);
  }, [item, isNewItem]);

  return (
    <div className="flex h-full w-full gap-12">
      <div className="flex h-[500px] flex-[5] flex-col rounded-3xl bg-secondary p-4">
        <div className="flex items-center py-2 pb-4 text-xl font-bold">
          <Image size={24} />
          <span className="ml-1">Image</span>
        </div>
        <div className="h-[420px] w-full rounded-3xl border border-dashed border-indigo-400 p-1">
          {updatedItem.image_url !== "" ? (
            <img
              src={
                updatedItem.image_url
                // "https://png.pngtree.com/png-vector/20191129/ourmid/pngtree-image-upload-icon-photo-upload-icon-png-image_2047545.jpg"
              }
              className="h-full w-full rounded-3xl object-contain"
              alt={updatedItem.name || "Placeholder"}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImagePlus size={128} />
            </div>
          )}
        </div>
      </div>

      <div className="flex-[7] space-y-4 rounded-3xl bg-secondary p-6 shadow-lg">
        <div>
          <Label htmlFor="name" className="text-primary">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Enter item name"
            value={updatedItem.name}
            onChange={(e) => {
              setUpdatedItem({ ...updatedItem, name: e.target.value });
            }}
            className="mt-1"
          />
        </div>

        <div className="flex space-x-6">
          <div className="w-1/2">
            <Label htmlFor="quantity" className="text-primary">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              value={updatedItem.quantity}
              className="mt-1"
              onChange={(e) =>
                setUpdatedItem({
                  ...updatedItem,
                  quantity: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="category" className="text-primary">
              Category
            </Label>
            <Select
              value={updatedItem.category}
              onValueChange={(value) => {
                setUpdatedItem({ ...updatedItem, category: value });
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {updatedItem.category || "Select a category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem> */}
                {allItems
                  .map((item) => item.category)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="w-1/2">
            <Label htmlFor="price" className="text-primary">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={updatedItem.price}
              className="mt-1"
              onChange={(e) =>
                setUpdatedItem({
                  ...updatedItem,
                  price: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="status" className="text-primary">
              Status
            </Label>
            <Select
              value={updatedItem.status}
              onValueChange={(value) => {
                setUpdatedItem({ ...updatedItem, status: value });
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {updatedItem.status === "in_stock"
                    ? "Available"
                    : "Out of Stock"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_stock">Available</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="w-1/2">
            <Label htmlFor="brand" className="text-primary">
              Brand
            </Label>
            <Input
              id="brand"
              placeholder="Enter brand"
              value={updatedItem.brand}
              className="mt-1"
              onChange={(e) =>
                setUpdatedItem({ ...updatedItem, brand: e.target.value })
              }
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="type" className="text-primary">
              Type
            </Label>
            <Input
              id="type"
              placeholder="Enter item type"
              value={updatedItem.attributes.type}
              className="mt-1"
              onChange={(e) =>
                setUpdatedItem({
                  ...updatedItem,
                  attributes: {
                    ...updatedItem.attributes,
                    type: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="w-1/2">
            <Label htmlFor="material" className="text-primary">
              Material
            </Label>
            <Input
              id="material"
              placeholder="Enter material"
              value={updatedItem.attributes.material}
              className="mt-1"
              onChange={(e) =>
                setUpdatedItem({
                  ...updatedItem,
                  attributes: {
                    ...updatedItem.attributes,
                    material: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="warranty_years" className="text-primary">
              Warranty Years
            </Label>
            <Input
              id="warranty_years"
              type="number"
              placeholder="Enter warranty years"
              value={updatedItem.attributes.warranty_years}
              className="mt-1"
              onChange={(e) =>
                setUpdatedItem({
                  ...updatedItem,
                  attributes: {
                    ...updatedItem.attributes,
                    warranty_years: Number(e.target.value),
                  },
                })
              }
            />
          </div>
        </div>
        <SetLocation
          item={updatedItem}
          locations={locations}
          onChange={(location) =>
            setUpdatedItem({ ...updatedItem, godown_id: location.id })
          }
        />
        <div className="flex justify-end space-x-4">
          <Button
            className="bg-slate-400"
            onClick={() => setUpdatedItem(isNewItem ? defaultItem : item)}
          >
            Reset
          </Button>
          <Button
            onClick={() => {
              onChange(updatedItem);
              setUpdatedItem(defaultItem);
              console.log(updatedItem);
            }}
          >
            {isNewItem ? "Add" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemView;
