const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const SubInventory = require('../models/sub.inventory');

class CartService {
  // async findCurrentUserShoppingCart(userId) {
  //   const cart = await Cart.findOne({ user: userId })
  //     .populate({
  //       path: 'items.product',
  //       select: 'name price description imageCover'
  //     });

  //   if (!cart) {
  //     return await this.createCartService({ user: userId, items: [] });
  //   }

  //   return cart;
  // }
  
  async findCurrentUserShoppingCart(userId) {
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.subInventory',
        populate: {
          path: 'product',
          select: 'name price description images isActive'
        }
      })
      .populate('items.branch');
  
    if (!cart) {
      return await this.createCartService({ user: userId, items: [] });
    }
  
    return cart;
  }
  async createCartService(cartData) {
    const cart = new Cart(cartData);
    return await cart.save();
  }

  // async clearCartService(userId) {
  //   const cart = await this.findCurrentUserShoppingCart(userId);
  //   if (cart) {
  //     for (const item of cart.items) {
  //       const product = await Product.findById(item.product);
  //       if (product) {
  //         product.quantity += item.quantity;
  //         await product.save();
  //       }
  //     }

  //     cart.items = [];
  //     await cart.save();
  //   }
  // }

  async clearCartService(userId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    
    if (cart) {
      for (const item of cart.items) {
        const subInventory = await SubInventory.findById(item.subInventory);
        if (subInventory) {
          subInventory.quantity += item.quantity;
          await subInventory.save();
        }
      }
  
      cart.items = [];
      await cart.save();
    }
  }
  

  async getCart(userId) {
    return await this.findCurrentUserShoppingCart(userId);
  }

  // async addToCartService(userId, productId, quantity = 1) {
  //   const cart = await this.findCurrentUserShoppingCart(userId);
  //   const product = await Product.findById(productId);
    
  //   if (!product) {
  //     throw new Error('Product not found');
  //   }

  //   const existingItem = cart.items.find(item => item.product.equals(productId));
    
  //   if (existingItem) {
  //     existingItem.quantity += quantity;
  //   } else {
  //     cart.items.push({
  //       product: productId,
  //       image: product.imageCover,
  //       quantity,
  //       price: product.price
  //     });
  //   }

  //   await cart.save();

  //   product.quantity -= quantity;
  //   await product.save();

  //   return cart;
  // }
  async addToCartService(userId, subInventoryId, quantity = 1) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const subInventory = await SubInventory.findById(subInventoryId).populate('product');
  
    if (!subInventory || !subInventory.active || subInventory.quantity < quantity) {
      throw new Error('Sub-inventory item not available or insufficient stock');
    }
  
    const existingItem = cart.items.find(item => item.subInventory.equals(subInventoryId));
  
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        subInventory: subInventoryId,
        branch: subInventory.branch,
        quantity,
        price: subInventory.product.price,
        image: subInventory.product.images[0]
      });
    }
  
    await cart.save();
    return cart;
  }
  

  // async deleteProductInShoppingCartService(userId, productId) {
  //   const cart = await this.findCurrentUserShoppingCart(userId);
  //   const item = cart.items.find(item => item.product.equals(productId));

  //   if (item) {
  //     const product = await Product.findById(productId);
  //     if (product) {
  //       product.quantity += item.quantity;
  //       await product.save();
  //     }

  //     cart.items = cart.items.filter(item => !item.product.equals(productId));
  //     await cart.save();
  //   }

  //   return cart;
  // }
  async deleteProductInShoppingCartService(userId, subInventoryId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const item = cart.items.find(item => item.subInventory.equals(subInventoryId));
  
    if (item) {
      const subInventory = await SubInventory.findById(subInventoryId);
      if (subInventory) {
        subInventory.quantity += item.quantity;
        await subInventory.save();
      }
  
      cart.items = cart.items.filter(item => !item.subInventory.equals(subInventoryId));
      await cart.save();
    }
  
    return cart;
  }
  
  // async incItemInCart(userId, productId) {
  //   const cart = await this.findCurrentUserShoppingCart(userId);
  //   const item = cart.items.find(item => item.product.equals(productId));

  //   if (!item) {
  //     throw new Error('Product not found in cart');
  //   }

  //   item.quantity += 1;
  //   await cart.save();

  //   const product = await Product.findById(productId);
  //   if (product) {
  //     product.quantity -= 1;
  //     await product.save();
  //   }

  //   return cart;
  // }
  async incItemInCart(userId, subInventoryId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const item = cart.items.find(item => item.subInventory.equals(subInventoryId));
  
    if (!item) {
      throw new Error('Item not found in cart');
    }
  
    const subInventory = await SubInventory.findById(subInventoryId);
    if (!subInventory || subInventory.quantity <= item.quantity) {
      throw new Error('Cannot increase quantity beyond available stock');
    }
  
    item.quantity += 1;
    await cart.save();
  
    subInventory.quantity -= 1;
    await subInventory.save();
  
    return cart;
  }
  
  // async decItemFromCart(userId, productId) {
  //   const cart = await this.findCurrentUserShoppingCart(userId);
  //   const item = cart.items.find(item => item.product.equals(productId));

  //   if (!item) {
  //     throw new Error('Product not found in cart');
  //   }

  //   if (item.quantity > 1) {
  //     item.quantity -= 1;
  //   } else {
  //     cart.items = cart.items.filter(item => !item.product.equals(productId));
  //   }

  //   await cart.save();

  //   const product = await Product.findById(productId);
  //   if (product) {
  //     product.quantity += 1;
  //     await product.save();
  //   }

  //   return cart;
  // }
  async decItemFromCart(userId, subInventoryId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const item = cart.items.find(item => item.subInventory.equals(subInventoryId));
  
    if (!item) {
      throw new Error('Item not found in cart');
    }
  
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter(item => !item.subInventory.equals(subInventoryId));
    }
  
    await cart.save();
  
    const subInventory = await SubInventory.findById(subInventoryId);
    if (subInventory) {
      subInventory.quantity += 1;
      await subInventory.save();
    }
  
    return cart;
  }
  

  // calculateTotalPrice(cart) {
  //   return cart.items.reduce((total, item) => {
  //     return total + (item.price * item.quantity);
  //   }, 0);
  // }
  
  // async createOrder(orderData) {
  //   try {
  //     const orderItems = [];
  //     let totalPrice = 0;

  //     for (const item of orderData.items) {
  //       const product = await Product.findById(item.productId);
  //       if (!product) {
  //         throw new Error(`Product not found: ${item.productId}`);
  //       }

  //       // Check if the requested quantity is available
  //       if (product.quantity < item.quantity) {
  //         throw new Error(`Insufficient product quantity for product: ${item.productId}`);
  //       }

  //       // Reduce the product quantity
  //       product.quantity -= item.quantity;
  //       await product.save();

  //       orderItems.push({
  //         productId: item.productId,
  //         price: product.price,
  //         quantity: item.quantity
  //       });

  //       totalPrice += product.price * item.quantity;
  //     }

  //     const order = new Order({
  //       orderId: Math.floor(Math.random() * 1000000), 
  //       customerId: orderData.userId,
  //       items: orderItems,
  //       totalPrice: totalPrice,
  //       status: orderData.status || 'Pending',
  //       paymentMethod: orderData.paymentMethod || 'Cash', 
  //       customerDetails: {
  //         firstName: orderData.customerDetails.firstName,
  //         lastName: orderData.customerDetails.lastName,
  //         address: {
  //           street: orderData.customerDetails.address.street,
  //           city: orderData.customerDetails.address.city,
  //           zipCode: orderData.customerDetails.address.zipCode
  //         },
  //         email: orderData.customerDetails.email,
  //         phone: orderData.customerDetails.phone
  //       },
  //       date: new Date()
  //     });

  //     return await order.save();
  //   } catch (error) {
  //     console.error('Error creating order:', error);
  //     throw new Error('Error creating order');
  //   }
  // }

  calculateTotalPrice(cart) {
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
}

module.exports = new CartService();
