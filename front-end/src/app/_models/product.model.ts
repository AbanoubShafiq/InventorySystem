export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  prevPrice?: number;
  noOfSale?: number;
  images: string[];
  isActive: boolean;
  quantity: number;
  distributedItems?: number;
  sellerId: {_id:string,firstName:'',lastName:''};
  categoryId: {_id:string,name:''};
  createdAt?: Date;
  updatedAt?: Date;
}

  