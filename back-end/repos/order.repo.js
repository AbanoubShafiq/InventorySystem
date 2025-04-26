const Order =require("./../models/order.model");
const mongoose = require('mongoose');
const Product = require("./../models/product.model");
const SubInventory  = require("./../models/sub.inventory");

// getAllUsers
module.exports.getOrders = async () => {
    try {
        const orders = await Order.find({});
        return orders;
    } catch (error) {
        throw new Error(`Error fetching Orders: ${error.message}`);
    }
}

// get order by User Id
module.exports.getOrdersByUserId = async (userId) => {
    try {
      const Orders = await Order.find({ customerId: userId })
        .populate("customerId", "firstName lastName email") 
        .populate("items.subInventoryId", "name price") 
        .exec();
        console.log(Orders);
      return Orders;
    } catch (error) {
        console.log(error.message)
      throw new Error("Could not retrieve orders");
    }
};

// get Order by orderId
module.exports.getOrderById = async (orderId) => {
    try
    {
        const order = await Order.findById(orderId);
        // if (!order)
        //     throw new Error("No Order With that id");
        return order;
    }catch(error)
    {
        throw new Error("Could not get order ")
    }
}



// return order based on status
module.exports.getOrdersByStatus = async (orderStatus) => {
    try
    {
        orderStatus = orderStatus.toLowerCase();
        const orders = await Order.find({status: orderStatus})
        return orders;
    }catch (error)
    {
        throw new Error ("Could not fetch orders by Status")
    }
}

// get order by customer and status
module.exports.getOrdersByCustomerAndStatus = async (customerId, status) => {
    try {
        status = status.toLowerCase();
        const orders = await Order.find({ customerId, status });
        return orders;
    } catch (error) {
        throw new Error("Could not retrieve orders.");
    }
};



module.exports.changeOrderStatus = async (orderId, changedStatus) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
            changedStatus = changedStatus.toLowerCase();
            const order = await Order.findById(orderId).session(session);

            if (!order) {
                    throw new Error("Order not found");
            }

            const previousStatus = order.status;
            order.status = changedStatus;
            await order.save({ session });

            // Handle quantity adjustments based on the status change
            if ((previousStatus === "shipped" &&  changedStatus === "refunded") || 
                    (previousStatus === "pending" && changedStatus === "cancelled")) {
                    // Revert the quantity back to stock
                    for (const item of order.items) {
                            const subInventory = await SubInventory.findById(item.subInventoryId).session(session);
                            
                            if (!subInventory) {
                                    throw new Error(`Sub-inventory ${item.subInventoryId} not found`);
                            }

                            subInventory.quantity += item.quantity;
                            subInventory.numberOfSales -= item.quantity;
                            await subInventory.save({ session });

                            // Decrease the number of sales for the product
                            const product = await Product.findById(subInventory.product).session(session);
                            if (!product) {
                                    throw new Error(`Product ${subInventory.product} not found`);
                            }

                            product.noOfSale -= item.quantity;
                            await product.save({ session });
                    }
            }

            await session.commitTransaction();
            session.endSession();

            return order; 
    } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new Error(error.message || "Could not change order status");
    }
};






module.exports.deleteOrder = async (orderId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
            const deletedOrder = await Order.findOneAndDelete({ _id: orderId }).session(session);

            // Loop through each item in the deleted order to return the quantity to the stock
            if (deletedOrder.status === "shipped" || deletedOrder.status === "pending") {
                for (const item of deletedOrder.items) {
                    const subInventory = await SubInventory.findById(item.subInventoryId).session(session);
                    
                    if (!subInventory) {
                            throw new Error(`Sub-inventory ${item.subInventoryId} not found`);
                    }

                    subInventory.quantity += item.quantity;
                    subInventory.numberOfSales -= item.quantity;
                    await subInventory.save({ session });

                    // Decrease the number of sales for the product
                    const product = await Product.findById(subInventory.product).session(session);
                    if (!product) {
                            throw new Error(`Product ${subInventory.product} not found`);
                    }

                    product.noOfSale -= item.quantity;
                    console.log(product.noOfSale);
                    await product.save({ session });
                }
            }

            await session.commitTransaction();
            session.endSession();
            
            return deletedOrder;
    } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new Error("Could not delete order: " + error.message);
    }
};



// module.exports.updateOrder = async (orderId, updatedData) => {
//     try {
//       const updatedOrder = await Order.findByIdAndUpdate(
//         {_id: orderId},
//         { $set: updatedData },
//         { new: true, runValidators: true }
//       );
//       console.log(this.updateOrder);
//       if (!updatedOrder) {
//         throw new Error("Order not found.");
//       }
  
//       return updatedOrder;
//     } catch (error) {
//       throw new Error("Could not update order.");
//     }
// };




module.exports.createOrder = async (orderDetails) => 
{
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
        // console.log(product.noOfSale);
        // if (typeof product.noOfSale !== 'number') {
        //     throw new Error(`Invalid number of sales for product ${subInventory.product}`);
        // }
        product.noOfSale += item.quantity;

        await product.save({ session });
      }
  
      // Assign the computed total price to the order details
      orderDetails.totalPrice = totalPrice;
  
      // Create the online order using the create method
      const createdOrder = await Order.create([orderDetails], { session });
  
      await session.commitTransaction();
      session.endSession();
      return createdOrder[0]; // since create method returns an array
  
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Could not create online order: " + error.message);
    }
}