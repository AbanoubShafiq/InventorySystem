export interface SubInventory {
    _id: string;
    mainInventory: string;
    product: Product;
    branch: string;
    quantity: number;
    numberOfSales?: number;
    lastUpdated?: Date;
    active?: boolean;
  }
  export interface Product {
    _id: string;
    name: string;
    price: number;
    prevPrice?: number;
    noOfSale?: number;
    images: string[];
    sellerId: {_id:string,firstName:'',lastName:''};
    categoryId: {_id:string,name:''};
  }
