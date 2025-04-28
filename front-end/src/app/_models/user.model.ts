export interface User {
  _id: string;
  role: 'customer' | 'seller' | 'admin' | 'manager'|'clerk'|'cashier';
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address?: Address;
  branch?:{_id:string,branchName:string}
  contactNo?: string;
  image?: string[];
  isActive?: boolean;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}
  