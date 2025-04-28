
import { Branch } from "./branch.model";
export interface OfflineOrder {
    _id?: string;
    items: OfflineOrderItem[];
    totalPrice: number;
    date?: string;
     branchId: string;
    branch?: Branch;
    status: "completed" | "canceled";
  }
  
  export interface OfflineOrderItem {
    subInventoryId: string;
    price: number;
    quantity: number;
    _id?: string;
  }
  