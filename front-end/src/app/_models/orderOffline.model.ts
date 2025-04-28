export interface OrderOffline {
    _id: string;
    items: OrderItem[];
    totalPrice: number;
    date:Date;
    branch: Branch;
    status: 'completed' | 'canceled';
  }
  
  export interface OrderItem {
    _id: string;
    subInventoryId: SubInventory;
    productDetails: {_id:string,name:string,price:number,prevPrice:number,images:string[],noOfSale:number,sellerId:{_id:string,firstName:string,lastName:string},categoryId:{_id:string,name:string}}
    price: number;
    quantity: number;
  }
  
  export interface SubInventory {
    product: string;
  }
  
  export interface Branch {
    _id: string;
    branchName: string;
  }