const MainInventory = require("./../models/main.inventory.model");
const mongoose = require('mongoose');
const Product = require('../models/product.model');

module.exports.createMainInventory = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if a main inventory with the same product already exists
    const existingMainInventory = await MainInventory.findOne({ product: data.product }).session(session);

    if (existingMainInventory) {
      // Increase the quantity of the existing main inventory
      existingMainInventory.quantity += data.quantity;
      await existingMainInventory.save({ session });

      // Update the product's quantity and distributedItems
      await Product.findByIdAndUpdate(data.product, {
        $inc: { 
          quantity: -data.quantity, 
          distributedItems: data.quantity 
        }
      }, { session });

      await session.commitTransaction();
      session.endSession();
      return existingMainInventory;
    } else {
      // Decrease the product's quantity and increase the distributedItems
      await Product.findByIdAndUpdate(data.product, {
        $inc: { 
          quantity: -data.quantity, 
          distributedItems: data.quantity 
        }
      }, { session });

      // Create the new inventory item
      const newItem = await MainInventory.create([data], { session });

      await session.commitTransaction();
      session.endSession();
      return newItem[0];
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Could not create item: " + error.message);
  }
};



// check if it is Product not product 
module.exports.getAllMainInventory = async () => {
  try {
    const items = await MainInventory.find().populate('product').exec();
    return items;
  } catch (error) {
    throw new Error("Could not get all items");
  }
};

module.exports.getMainInventoryById = async (id) => {
  try {
    const item = await MainInventory.findById(id).populate('product').exec();
    return item;
  } catch (error) {
    throw new Error("Could not get item by ID");
  }
};


module.exports.updateMainInventoryById = async (id, data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingItem = await MainInventory.findById(id).session(session);
    if (!existingItem) {
      throw new Error("Inventory item not found");
    }

    const product = await Product.findById(existingItem.product).session(session);
    if (!product) {
      throw new Error("Product not found");
    }

    // Calculate the difference in quantity
    const quantityDifference = data.quantity - existingItem.quantity;

    // Handle increase in quantity
    if (quantityDifference > 0) {
      // Check if there is sufficient quantity available in the product
      if (product.quantity < quantityDifference) {
        throw new Error("Insufficient product quantity");
      }

      // Decrease product quantity and increase distributedItems
      product.quantity -= quantityDifference;
      product.distributedItems += quantityDifference;
    } 
    // Handle decrease in quantity
    else if (quantityDifference < 0) {
      // Increase product quantity and decrease distributedItems
      product.quantity -= quantityDifference;  // Since quantityDifference is negative
      product.distributedItems += quantityDifference;  // Since quantityDifference is negative
    }

    // Verify if the new quantity is valid
    if (data.quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }

    // Verify if the distributed value is valid
    // if (data.distributed > data.quantity) {
    //   throw new Error("Distributed quantity cannot be greater than available quantity");
    // }

    await product.save({ session });

    // Update the inventory item
    const updatedItem = await MainInventory.findByIdAndUpdate(id, data, { new: true, session });

    await session.commitTransaction();
    session.endSession();
    return updatedItem;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Could not update item by ID: " + error.message);
  }
};

module.exports.deleteMainInventoryById = async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const item = await MainInventory.findById(id).session(session);
      if (!item) {
        throw new Error("Inventory item not found");
      }
  
      // Check if the distributed quantity is 0
      if (item.distributed > 0) {
        throw new Error("Cannot delete inventory item with distributed quantity greater than 0");
      }
  
      // Update the product's quantity before deleting the inventory item
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error("Product not found");
      }
  
      product.quantity += item.quantity;
      product.distributedItems -= item.quantity
      await product.save({ session });
  
      // Delete the inventory item
      const deletedItem = await MainInventory.findByIdAndDelete(id).session(session);
  
      await session.commitTransaction();
      session.endSession();
      return deletedItem;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Could not delete item by ID: " + error.message);
    }
  };

