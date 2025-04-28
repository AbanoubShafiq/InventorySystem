export interface MainInventory {
    _id: string;
    product:Product; 
    quantity: number;
    distributed?: number;
    lastUpdated?: Date;
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
  