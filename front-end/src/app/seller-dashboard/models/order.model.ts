export interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  status: 'pending' | 'shipped' | 'completed' | 'cancelled' | 'returned';
  paymentMethod: string;
  customerDetails: CustomerDetails;
  totalPrice: number;  
  date: string;        
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  product?: {
    sellerId: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
  subInventoryId?: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}