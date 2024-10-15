import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import Item from "~/models/item";
import Location from "~/models/location";
import { useSidebar } from "./sidebar/provider";
import { useData } from "~/providers/dataProvider";

export function ContextMenuDemo({
  children,
  location,
  item,
}: {
  children: React.ReactNode;
  location?: Location;
  item?: Item;
}) {
  const {
    focusedItem,
    foucusedLocation,
    setFocusedItem,
    setFocusedLocation,
    initiateNewLocation,
    locations,
  } = useSidebar();
  const { items, setItems, selectedItem, setSelectedItem } = useData();
  const isSubLocation = (location: Location) =>
    !locations.some((l) => l.parent_godown === location.id);

  const addNewItem = () => {
    const newItem = new Item({
      item_id: "new_item",
      godown_id: location!.id,
      name: "New Item",
      quantity: 0,
      price: 0,
      image_url: "",
      attributes: {},
    });
    setItems((prev) => [...prev, newItem]);
    setSelectedItem(newItem);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="">{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          inset
          onClick={() => {
            setFocusedLocation(location ?? null);
          }}
        >
          Rename location
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Delete location
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onClick={() => {
            initiateNewLocation(location!);
          }}
          disabled={isSubLocation(location!)}
        >
          Add sub location
        </ContextMenuItem>

        <ContextMenuSeparator />
        <ContextMenuItem
          inset
          disabled={!isSubLocation(location!)}
          onClick={addNewItem}
        >
          Add Item
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Remove Item
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
