export interface Seller {
  _id: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  contactNo: string;
  isActive: boolean;
  user_id?: string;
}

export interface Supplier {
  _id: string;
  companyName: string;
  email: string;
  contactNo: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  image?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId: string;
  sellerId: string;
  isActive: boolean;
  images: string[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: Category;
  sellerId: string;
  isActive: boolean;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
  noOfSale?: number;
  distributedItems?: number;
  prevPrice?: number;
}

export interface ProductSubmitData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;  
  sellerId?: string;
  isActive?: boolean;
  images: string[]; 
}

export const DEFAULT_CATEGORIES: Category[] = [
  { _id: '', name: 'Men', description: '', isActive: true, image: [] },
  { _id: '', name: 'Women', description: '', isActive: true, image: [] },
  { _id: '', name: 'Unisex', description: '', isActive: true, image: [] }
];

export const DEFAULT_CATEGORY: Category = DEFAULT_CATEGORIES[0];