const OfflineOrder = require("./../models/offilne.order.model");
const mongoose = require('mongoose');
const Product = require("./../models/product.model");
const SubInventory  = require("./../models/sub.inventory");


module.exports.getAllOfflineOrders = async () => {
    try {
        const offlineOrders = await OfflineOrder.find()
          .populate('items.subInventoryId')
          .populate('branch')
          .exec();
        return offlineOrders;
    }
    catch (error) {
        throw new Error("Error retrieving offline orders");
    }
}


module.exports.getAllOrdersByBranchId = async (branchId) => {
    try {
        const offlineOrders = await OfflineOrder.find({ branch: branchId })
          .populate('items.subInventoryId')
          .populate('branch')
          .exec();
        return offlineOrders;
      } catch (error) {
        throw new Error("Could not get sub-inventory by ID");
      }
}


module.exports.getOfflineOrderById = async (orderId) => {
    try {
        const offlineOrder = await OfflineOrder.findById(orderId)
          .populate('items.subInventoryId')
          .populate('branch')
          .exec();
        return offlineOrder;
      } catch (error) {
        throw new Error("Could not get offline order by ID");
      }
}



module.exports.createOfflineOrder = async (orderDetails) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalPrice = 0;

    // Loop through each item in the order
    for (const item of orderDetails.items) {
      const subInventory = await SubInventory.findById(item.subInventoryId).session(session);
      
      if (!subInventory) {
        throw new Error(`Sub-inventory ${item.subInventoryId} not found`);
      }

      const product = await Product.findById(subInventory.product).session(session);
      if (!product) {
        throw new Error(`Product ${subInventory.product} not found`);
      }

      // Assign the product's price to the item
      item.price = product.price;

      // Check if there is enough quantity available
      if (subInventory.quantity < item.quantity) {
        throw new Error(`Not enough quantity in sub-inventory ${item.subInventoryId}`);
      }

      // Calculate the total price for the item
      totalPrice += item.price * item.quantity;

      // Decrease the quantity and increase the number of sales
      subInventory.quantity -= item.quantity;
      subInventory.numberOfSales += item.quantity;
      await subInventory.save({ session });

      // Increase the number of sales for the product
      product.noOfSale += item.quantity;
      await product.save({ session });
    }

    // Assign the computed total price to the order details
    orderDetails.totalPrice = totalPrice;

    // Create the offline order using the create method
    const offlineOrder = await OfflineOrder.create([orderDetails], { session });

    await session.commitTransaction();
    session.endSession();
    return offlineOrder[0]; // since create method returns an array

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Could not create offline order: " + error.message);
  }
};



module.exports.cancelOfflineOrder = async (orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Retrieve the existing offline order
    const existingOrder = await OfflineOrder.findById(orderId).session(session);
    
    // Revert the changes made to the sub-inventories and products
    for (const item of existingOrder.items) {
      const subInventory = await SubInventory.findById(item.subInventoryId).session(session);
      if (subInventory) {
        subInventory.quantity += item.quantity;
        subInventory.numberOfSales -= item.quantity;
        await subInventory.save({ session });

        const product = await Product.findById(subInventory.product).session(session);
        if (product) {
          product.noOfSale -= item.quantity;
          await product.save({ session });
        }
      }
    }

    // Update the order status to "canceled"
    existingOrder.status = 'canceled';
    await existingOrder.save({ session });

    await session.commitTransaction();
    session.endSession();
    return existingOrder;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Could not cancel offline order: " + error.message);
  }
};


