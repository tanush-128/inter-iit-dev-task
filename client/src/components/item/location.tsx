import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Item from "~/models/item";
import Location from "~/models/location";
import { Label } from "../ui/label";

const SetLocation = ({
  item,
  locations,
  onChange,
}: {
  item: Item;
  locations: Location[];
  onChange: (updateLocation: Location) => void;
}) => {
  const [location, setLocation] = useState<Location | null>(
    locations.find((l) => l.id === item.godown_id) || null,
  );

  const [reqLocations, setReqLocations] = useState<Location[]>([]);

  useEffect(() => {
    setLocation(locations.find((l) => l.id === item.godown_id) || null);
  }, [item]);

  useEffect(() => {
    if (location) {
      onChange(location);
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      let loc: Location | undefined = location; // use let instead of var to limit the scope and ensure block scoping
      const newReqLocations: Location[] = [loc]; // Initiate newReqLocations with the current location

      while (loc && loc.parent_godown !== null) {
        loc = locations.find((l) => l.id === loc?.parent_godown); // Find parent godown location
        if (loc) {
          newReqLocations.push(loc); // Push the found location
        }
      }

      // Reverse to maintain order and update the state
      setLocation(newReqLocations[0]!);
      setReqLocations(newReqLocations.reverse());
    }
  }, [location, locations]); // Add locations to the dependency array

  const changeLocation = (loc: Location) => {
    let newReqLocations = [loc];
    //find all parent locations
    let newLoc = loc;
    while (newLoc && newLoc.parent_godown !== null) {
      newLoc = locations.find((l) => l.id === newLoc.parent_godown)!;
      if (newLoc) {
        newReqLocations.push(newLoc);
      }
    }

    // find all child locations
    let childLocations = locations.filter((e) => e.parent_godown === loc.id);
    while (childLocations.length > 0) {
      const childLocation = childLocations[0]!;
      newReqLocations = [childLocation, ...newReqLocations];
      childLocations = locations.filter(
        (e) => e.parent_godown === childLocation.id,
      );
    }
    setLocation(newReqLocations[0]!);
    setReqLocations(newReqLocations.reverse());
  };
  return (
    <div>
      <Label htmlFor="godown" className="text-primary">
        Location
      </Label>
      <div className="p-2">
        {reqLocations.map((loc) => (
          <div key={loc.id} className="">
            <LocationSelect
              location={loc}
              allLocations={locations}
              setLocation={changeLocation}
            />
            {loc.id !== location?.id && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 25 25"
                className="ml-5 h-6 text-red-500"
              >
                <path
                  className="fill-current"
                  d="m18.294 16.793-5.293 5.293V1h-1v21.086l-5.295-5.294-.707.707L12.501 24l6.5-6.5-.707-.707z"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const LocationSelect = ({
  location,
  allLocations,

  setLocation,
}: {
  location: Location;
  setLocation: (loc: Location) => void;
  allLocations: Location[];
}) => {
  const locations = allLocations.filter(
    (l) => l.parent_godown === location.parent_godown,
  );
  if (location.id === "") {
    return null;
  }
  return (
    <Select
      value={location.id}
      onValueChange={(value) => {
        setLocation(allLocations.find((l) => l.id === value) || location);
      }}
    >
      <SelectTrigger>
        <SelectValue defaultValue={location.id}>{location.name}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locations.map((location) => (
          <SelectItem key={location.id} value={location.id} onClick={() => {}}>
            {location.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { SetLocation };
