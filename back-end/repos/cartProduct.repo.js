const Product = require('../models/product.model');

const findProductById = async (productId) => {
  return await Product.findById(productId);
};

module.exports = {
  findProductById
};
