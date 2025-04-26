export interface SalesClerkInventory {
  _id: string;
  name: string;
  inventoryName: string;
  stock: number;          // Added this
  price: number;          // Added this
  lastRestocked: Date;    // Added this
  isActive: boolean;
  product?: {
    name: string;
    description?: string;
  };
  branch?: {
    name: string;
  };
}