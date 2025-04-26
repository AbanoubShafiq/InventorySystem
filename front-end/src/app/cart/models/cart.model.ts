// export interface IProduct {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
//   quantity: number;
// }

// // This model represents the cart items
// export interface ICartProduct {
//   _id: string;
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     quantity: number;
//     images: string[];
//   };
//   image: string;
//   quantity: number;
//   price: number;
// }

// export interface ICartRes {
//   status: string;
//   data: ICartData;
//   numOfCartItems: number;
// }

// export interface ICartData {
//   _id: string;
//   user: string;
//   items: ICartProduct[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   totalCartPrice: number;
// }
/////////////////////////////////
///
// export class Cart {
//   constructor(
//     public _id: string,
//     public user: string,
//     public items: {
//       subInventory: string,
//       branch: string,
//       image: string,
//       quantity: number,
//       price: number,
//       _id: string
//     }[],
//     public __v: number
//   ) {}
// }
//////
// export interface ICartRes {
//   status: string;
//   data: ICartData;
//   numOfCartItems: number;
// }

// export interface ICartData {
//   _id: string;
//   user: string;
//   items: ICartProduct[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   totalCartPrice: number;
// }

// export interface ICartProduct {
//   _id: string;
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     quantity: number;
//     images: string[];
//     description: string;
//     isActive: boolean;
//   };
//   image: string;
//   quantity: number;
//   price: number;
// }


export class Cart {
  constructor(
    public _id: string,
    public cart_id: string,
    public items: {
      subInventory: {
        _id: string,
        product: {
          _id: string,
          name: string,
          price: number,
          quantity: number,
          images: string[]
        },
        branch: {
          _id: string,
          branchName: string
        },
        quantity: number,
        price: number,
        image: string
      },
      quantity: number,
      price: number
    }[],
    public customer_id: string,
    public createdAt: Date,
    public updatedAt: Date,
    public Total: number,
  ) {}
}