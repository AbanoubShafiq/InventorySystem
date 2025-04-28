export interface Order {
  _id?: string;
  customerId: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "shipped" | "completed" | "cancelled" | "returned" | "refunded";
  paymentMethod: "Cash" | "Card" | "Online";
  date?: string;
  customerDetails: CustomerDetails;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  price: number;
  quantity: number;
  _id?: string;
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
  