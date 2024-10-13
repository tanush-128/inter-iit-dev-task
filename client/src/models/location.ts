import { BACKEND_URL } from "~/constants";

class Location {
  id: string;
  name: string;
  parent_godown: string | null;

  constructor(location: any) {
    this.id = location.id;
    this.name = location.name;
    this.parent_godown = location.parent_godown;
  }

  static fromJson(location: any) {
    return new Location(location);
  }

  static backend_url = BACKEND_URL;

  static async getLocations() {
    const response = await fetch(`${Location.backend_url}/location/`);

    const locations = await response.json();
    return locations.map((location: any) => Location.fromJson(location));

    // return locations.map((location) => Location.fromJson(location));
  }

  static async update(location: Location) {
    const response = await fetch(`${Location.backend_url}/location/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    if (!response.ok) {
      throw new Error("Failed to update location");
    }
  }

  static async create(location: Location) {
    const response = await fetch(`${Location.backend_url}/location/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    const newLocationData = await response.json();
    return Location.fromJson(newLocationData);
  }
}

export default Location;
