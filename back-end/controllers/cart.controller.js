

const Cart = require('../models/cart.model');
const Product = require('../models/product.model'); 
const CartService=require('../services/cart.service');
const SubInventory = require('../models/sub.inventory'); 
const Branch = require('../models/branch.model'); 

const findProductById = async (productId) => {
  return await Product.findById(productId);
};

const decItemFromCart = async (req, res) => {
  try {
    const { userId, subInventoryId } = req.params;
    
    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ error: "Cart not found for this user" });

    const itemIndex = cart.items.findIndex(item => item.subInventory.equals(subInventoryId));

    if (itemIndex === -1) return res.status(404).json({ error: "Item not found in cart" });

    const item = cart.items[itemIndex];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    res.status(200).json({ message: "Product quantity decreased", userCart: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const incItemInCart = async (req, res) => {
  try {
    const { userId, subInventoryId } = req.params;

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.subInventory',
        populate: {
          path: 'product',
          select: 'name price description images isActive quantity'
        }
      })
      .exec();

    if (!cart) {
      return res.status(404).json({ error: "Cart not found for this user" });
    }

    const itemIndex = cart.items.findIndex(item => item.subInventory._id.equals(subInventoryId));

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Sub-inventory item not found in cart" });
    }

    const item = cart.items[itemIndex];
    if (item.quantity < item.subInventory.product.quantity) {
      item.quantity += 1;
      await cart.save();
      return res.status(200).json({ message: "Product quantity increased", userCart: cart });
    } else {
      return res.status(400).json({ error: "Cannot increase quantity beyond available stock" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const addProductsToShoppingCart = async (req, res) => {
  try {
    const { userId, subInventoryId, quantity } = req.body;
    
    let userCart = await Cart.findOne({ user: userId });
    const subInventory = await SubInventory.findById(subInventoryId).populate('product branch');

    if (!subInventory || !subInventory.active || subInventory.quantity < quantity) {
      return res.status(400).json({ error: 'Sub-inventory item not available or insufficient stock' });
    }

    if (!userCart) {
      userCart = new Cart({
        user: userId,
        items: [{
          subInventory: subInventoryId,
          branch: subInventory.branch._id,
          quantity,
          price: subInventory.product.price,
          image: subInventory.product.images[0]
        }]
      });
      await userCart.save();
    } else {
      const existingItem = userCart.items.find(item => item.subInventory.equals(subInventoryId));
      
      if (existingItem) {
        if (existingItem.quantity + quantity > subInventory.quantity) {
          return res.status(400).json({ error: 'Cannot add more than available stock' });
        }
        existingItem.quantity += quantity;
      } else {
        userCart.items.push({
          subInventory: subInventoryId,
          branch: subInventory.branch._id,
          quantity,
          price: subInventory.product.price,
          image: subInventory.product.images[0]
        });
      }
      await userCart.save();
    }
    res.json({ message: "Product added to cart successfully", userCart });
  } catch (error) {
    res.status(500).json({ error: "Error adding product to cart: " + error });
  }
};

const createCart = async (req, res) => {
  try {
    const { userId, items } = req.body;
    let userCart = await Cart.findOne({ user: userId });

    if (userCart) {
      for (const item of items) {
        const subInventory = await SubInventory.findById(item.subInventoryId).populate('product branch');
        if (!subInventory || !subInventory.active || subInventory.quantity < item.quantity) {
          return res.status(404).json({ error: `Sub-inventory item not available or insufficient stock` });
        }

        const existingItem = userCart.items.find(cartItem => cartItem.subInventory && cartItem.subInventory.equals(item.subInventoryId));

        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          userCart.items.push({
            subInventory: item.subInventoryId,
            branch: subInventory.branch._id,
            quantity: item.quantity,
            price: subInventory.product.price, 
            image: subInventory.product.images[0]
          });
        }
      }
      await userCart.save();
      return res.status(200).json({ message: "Items added to existing cart", userCart });
    } else {
      const itemsWithDetails = await Promise.all(items.map(async item => {
        const subInventory = await SubInventory.findById(item.subInventoryId).populate('product branch');
        if (!subInventory || !subInventory.active || subInventory.quantity < item.quantity) {
          throw new Error(`Sub-inventory item not available or insufficient stock`);
        }
        return {
          subInventory: item.subInventoryId,
          branch: subInventory.branch._id,
          quantity: item.quantity,
          price: subInventory.product.price,
          image: subInventory.product.images[0]
        };
      }));

      const newCart = new Cart({
        user: userId,
        items: itemsWithDetails
      });

      await newCart.save();
      return res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getCartByUserId = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate({
        path: 'items.subInventory',
        populate: {
          path: 'product',
          select: 'name description price images isActive'
        }
      })
      .populate('items.branch');

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// const getCartByUserId = async (req, res) => {
//   try {
//     if (!cart) return res.status(404).json({ error: 'Cart not found' });

//     const cart = await Cart.findOne({ user: req.params.userId })
//       .populate({
//         path: 'items.subInventory',
//         populate: {
//           path: 'product',
//           select: 'name description price images isActive'
//         }
//       })
//       .populate('items.branch');

//     if (!cart) return res.status(404).json({ error: 'Cart not found' });

//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true, runValidators: true });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const removeProductFromCart = async (req, res) => {
  try {
    const { userId, subInventoryId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found for this user" });

    const itemIndex = cart.items.findIndex(item => item.subInventory.equals(subInventoryId));
    if (itemIndex === -1) return res.status(404).json({ error: "Item not found in cart" });

    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.status(200).json({ message: "Item removed from cart", userCart: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getProductFromCart = async (req, res) => {
  try {
    const { userId, subInventoryId } = req.params;

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.subInventory',
        populate: {
          path: 'product',
          select: 'name description price images isActive'
        }
      })
      .populate('items.branch');

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(item => item.subInventory._id.toString() === subInventoryId);

    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
    res.status(500).json({ error: error.message });
  }
};


const getProductDetailsFromCart = async (req, res) => {
  try {
    const { userId, subInventoryId } = req.params;
    
    const cart = await Cart.findOne({ user: userId }).populate('items.subInventory');

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.subInventory._id.toString() === subInventoryId);

    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    const subInventory = await SubInventory.findById(subInventoryId).populate('product branch');

    if (!subInventory) return res.status(404).json({ message: 'SubInventory item not found' });

    res.json({
      product: subInventory.product,
      branch: subInventory.branch,
      quantityInCart: item.quantity,
      price: item.price,
      image: item.image
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const mongoose = require('mongoose');



module.exports = {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart,
  addProductsToShoppingCart,
  removeProductFromCart,
  getProductFromCart,
  incItemInCart,
  decItemFromCart,
  getProductDetailsFromCart,
  // createOrder
};


