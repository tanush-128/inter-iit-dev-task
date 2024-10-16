import { BACKEND_URL } from "~/constants";

class Item {
  item_id: string;
  name: string;
  quantity: number;
  category: string;
  price: number;
  status: string;
  godown_id: string;
  brand: string;
  attributes: {
    type: string;
    material: string;
    warranty_years: number;
  };
  image_url: string;

  constructor(item: any) {
    this.item_id = item.item_id;
    this.name = item.name;
    this.quantity = item.quantity;
    this.category = item.category;
    this.price = item.price;
    this.status = item.status;
    this.godown_id = item.godown_id;
    this.brand = item.brand;
    this.attributes = item.attributes;
    this.image_url = item.image_url;
  }

  static fromJson(item: any) {
    return new Item(item);
  }

  static backend_url = BACKEND_URL;

  static async getItems() {
    const response = await fetch(`${Item.backend_url}/item/`);
    const items = await response.json();
    return items.map((item: any) => Item.fromJson(item));
  }

  static async updateItem(item: Item) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${Item.backend_url}/item/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });
    const updatedItemData = await response.json();
    return Item.fromJson(updatedItemData);
  }

  static async createItem(item: Item) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${Item.backend_url}/item/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      // mode: "no-cors",
      body: JSON.stringify(item),
    });
    const newItemData = await response.json();
    return Item.fromJson(newItemData);
  }

  static async deleteItem(item: Item) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${Item.backend_url}/item/${item.item_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete item");
    }
  }
}

export default Item;
