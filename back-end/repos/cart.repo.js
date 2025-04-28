const Cart = require('../models/cart.model');

const findCartByUserId = async (userId) => {
  return await Cart.findOne({ user: userId });
};

const createCart = async (cartData) => {
  const newCart = new Cart(cartData);
  return await newCart.save();
};

const updateCartByUserId = async (userId, updateData) => {
  return await Cart.findOneAndUpdate({ user: userId }, updateData, { new: true, runValidators: true });
};

const deleteCartByUserId = async (userId) => {
  return await Cart.findOneAndDelete({ user: userId });
};

const addProductToCart = async (userId, productData) => {
  let userCart = await Cart.findOne({ user: userId });

  if (!userCart) {
    const newCart = new Cart({
      user: userId,
      items: [productData]
    });
    return await newCart.save();
  }

  const existingItem = userCart.items.find(item => item.product.equals(productData.product));
  
  if (existingItem) {
    existingItem.quantity += productData.quantity;
  } else {
    userCart.items.push(productData);
  }

  return await userCart.save();
};

const removeProductFromCart = async (userId, productId) => {
  const userCart = await Cart.findOne({ user: userId });

  if (!userCart) {
    return null;
  }

  const productIndex = userCart.items.findIndex(item => item.product.equals(productId));

  if (productIndex === -1) {
    return null;
  }

  userCart.items.splice(productIndex, 1);
  return await userCart.save();
};

module.exports = {
  findCartByUserId,
  createCart,
  updateCartByUserId,
  deleteCartByUserId,
  addProductToCart,
  removeProductFromCart
};
