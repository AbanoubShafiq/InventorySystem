export interface BranchProduct {
  _id: string;
  mainInventory: {
    _id: string;
    name: string;
    price: number;
  };
  product: {
    _id: string;
    name: string;
    category: string;
  };
  branch: string;
  quantity: number;
  numberOfSales: number;
  lastUpdated: Date;
  active: boolean;
  status?: 'Active' | 'Inactive';  
}