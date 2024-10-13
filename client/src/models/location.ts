//   {
//     "id": "d72518e97c3f4a68979153f2b8e9308e",
//     "name": "Torres, Rowland and Peters Warehouse",
//     "parent_godown": null
//   },

import { locations } from "~/data/godowns";

// export interface Location {
//   id: string;
//   name: string;
//   parent_godown: string | null;
// }

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

  static backend_url = "http://localhost:8080";

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
}

export default Location;
