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

export function ContextMenuDemo({
  children,
  location,
  item,
}: {
  children: React.ReactNode;
  location?: Location;
  item?: Item;
}) {
  const { focusedItem, foucusedLocation, setFocusedItem, setFocusedLocation } =
    useSidebar();
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
        <ContextMenuItem inset>Add sub location</ContextMenuItem>

        <ContextMenuSeparator />
        <ContextMenuItem inset>Add Item</ContextMenuItem>
        <ContextMenuItem inset disabled>
          Remove Item
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
