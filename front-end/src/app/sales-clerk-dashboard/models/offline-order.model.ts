export interface SubInventoryItem {
  _id: string;
  mainInventory: string;
  product: string;
  branch: string;
  quantity: number;
  numberOfSales: number;
  active: boolean;
  lastUpdated: Date;
}

export interface OrderItem {
  subInventoryId: SubInventoryItem;
  price: number;
  quantity: number;
  _id: string;
}

export interface Branch {
  _id: string;
  branchName: string;
  location: string;  
  contactNumber?: string;
  type?: 'offline' | 'online';
  isActive?: boolean;
}

export interface OfflineOrder {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  branch: Branch;
  status: 'pending' | 'completed' | 'canceled';
  date: Date;  
}