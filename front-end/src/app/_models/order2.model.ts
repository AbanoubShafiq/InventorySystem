export interface Order {
    _id: string;
    customerId: string;
    items: OrderItem[];
    totalPrice: number;
    status: "pending" | "shipped" | "cancelled" | "refunded";
    paymentMethod: "Cash" | "Card" | "Online";
    date: string;
    customerDetails: CustomerDetails;
    notes?: string;
  }
  
  export interface OrderItem {
    subInventoryId: string;
    price: number;
    productDetails: {_id:string,name:string,price:number,prevPrice:number,images:string[],noOfSale:number,sellerId:{_id:string,firstName:string,lastName:string},categoryId:{_id:string,name:string}};
    quantity: number;
    _id: string;
  }
  
  export interface CustomerDetails {
    firstName: string;
    lastName: string;
    address: Address;
    email: string;
    phone: string;
  }
  
  export interface Address {
    street: string;
    city: string;
    zipCode: string;
  }
  