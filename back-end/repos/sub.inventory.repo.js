const mongoose = require('mongoose');
const SubInventory = require("./../models/sub.inventory");
const MainInventory = require('../models/main.inventory.model');  

module.exports.createSubInventory = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  let newItem;  // Declare newItem outside try block to ensure it's accessible in both try and catch blocks

  try {
    const mainInventory = await MainInventory.findById(data.mainInventory).session(session);

    // Check if sub-inventory with the same mainInventory and branch exists
    const existingSubInventory = await SubInventory.findOne({
      mainInventory: data.mainInventory,
      branch: data.branch
    }).session(session);

    if (existingSubInventory) {
      // If exists, just update the quantity
      existingSubInventory.quantity += data.quantity;
      // existingSubInventory.numberOfSales += data.numberOfSales;  // Update other fields if necessary
      existingSubInventory.lastUpdated = Date.now();
      await existingSubInventory.save({ session });
    } else {
      // Otherwise, create a new sub-inventory
      newItem = await SubInventory.create([data], { session });
    }

    // Update main inventory
    mainInventory.quantity -= data.quantity;
    mainInventory.distributed += data.quantity;
    await mainInventory.save({ session });

    await session.commitTransaction();
    return existingSubInventory || newItem[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

  module.exports.getAllSubInventories = async () => {
    try {
      const subInventories = await SubInventory.find().populate('mainInventory product branch').exec();
      return subInventories;
    } catch (error) {
      throw new Error("Could not get all sub-inventories");
    }
  };

  module.exports.getSubInventoryById = async (id) => {
    try {
      const subInventory = await SubInventory.findById(id).populate('mainInventory product branch').exec();
      return subInventory;
    } catch (error) {
      throw new Error("Could not get sub-inventory by ID");
    }
  };
  

  module.exports.getSubInventoriesByBranchName = async (branchId) => {
    try {
      const subInventories = await SubInventory.find({ branch: branchId })
        .populate('mainInventory product branch')
        .exec();
  
      return subInventories;
    } catch (error) {
      throw new Error(error.message || "Could not get sub-inventories");
    }
  };



module.exports.getActiveSubInventoriesByBranchId = async (branchId) => {
  try {
    const subInventories = await SubInventory.find({ branch: branchId, active: true })
      .populate('mainInventory product branch')
      .exec();

    return subInventories;
  } catch (error) {
    throw new Error(error.message || "Could not get active sub-inventories by branch ID");
  }
}


module.exports.getDeactiveSubInventoriesByBranchId = async (branchId) => {
  try {
    const subInventories = await SubInventory.find({ branch: branchId, active: false })
      .populate('mainInventory product branch')
      .exec();

    return subInventories;
  } catch (error) {
    throw new Error(error.message || "Could not get deactive sub-inventories by branch ID");
  }
}



module.exports.getActiveSubInventoriesByBranchName = async (branchId) => {
  try {
    const subInventories = await SubInventory.find({ branch: branchId, active: true })
      .populate('mainInventory product branch')
      .exec();

    return subInventories;
  } catch (error) {
    throw new Error(error.message || "Could not get active sub-inventories by branch ID");
  }
}


module.exports.getDeactiveSubInventoriesByBranchName = async (branchId) => {
  try {
    const subInventories = await SubInventory.find({ branch: branchId, active: false })
      .populate('mainInventory product branch')
      .exec();

    return subInventories;
  } catch (error) {
    throw new Error(error.message || "Could not get deactive sub-inventories by branch ID");
  }
}




module.exports.activeSubInventory = async (subInventoryId) => {
  try {
    const updatedSubInventory = await SubInventory.findByIdAndUpdate(
      subInventoryId,
      { active: true },
      { new: true }  
    ).populate('mainInventory product branch')
     .exec();

    if (!updatedSubInventory) {
      throw new Error("Sub-inventory not found");
    }

    return updatedSubInventory;
  } catch (error) {
    console.error(error.message || "Could not activate sub-inventory");
    throw new Error(error.message || "Could not activate sub-inventory");
  }
};


module.exports.deactiveSubInventory = async (subInventoryId) => {
  try {
    const updatedSubInventory = await SubInventory.findByIdAndUpdate(
      subInventoryId,
      { active: false },
      { new: true }  
    ).populate('mainInventory product branch')
     .exec();

    if (!updatedSubInventory) {
      throw new Error("Sub-inventory not found");
    }

    return updatedSubInventory;
  } catch (error) {
    console.error(error.message || "Could not deactivate sub-inventory");
    throw new Error(error.message || "Could not deactivate sub-inventory");
  }
};



module.exports.deleteSubInventory = async (subInventoryId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subInventory = await SubInventory.findById(subInventoryId).session(session);

    const mainInventory = await MainInventory.findById(subInventory.mainInventory).session(session);

    // Update the main inventory quantities
    mainInventory.quantity += subInventory.quantity;
    mainInventory.distributed -= subInventory.quantity;
    await mainInventory.save({ session });

    // Delete the sub-inventory
    await SubInventory.findByIdAndDelete(subInventoryId).session(session);

    await session.commitTransaction();
    session.endSession();
    return { message: "Sub-inventory deleted successfully" };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error.message || "Could not delete sub-inventory");
    throw new Error(error.message || "Could not delete sub-inventory");
  }
};



module.exports.decreaseSubInventoryQuantity = async (id, quantityToDecrease) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subInventory = await SubInventory.findById(id).session(session);

    const mainInventory = await MainInventory.findById(subInventory.mainInventory).session(session);

    // Update sub-inventory quantity
    subInventory.quantity -= quantityToDecrease;
    subInventory.lastUpdated = Date.now();
    await subInventory.save({ session });

    // Update main inventory
    mainInventory.quantity += quantityToDecrease;
    mainInventory.distributed -= quantityToDecrease;
    await mainInventory.save({ session });

    await session.commitTransaction();
    session.endSession();
    return subInventory;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error.message || "Could not update sub-inventory by ID");
    throw new Error(error.message || "Could not update sub-inventory by ID");
  }
};



module.exports.increaseSubInventoryQuantity = async (id, quantityToIncrease) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subInventory = await SubInventory.findById(id).session(session);
    // if (!subInventory) {
    //   throw new Error("Sub-inventory not found");
    // }

    const mainInventory = await MainInventory.findById(subInventory.mainInventory).session(session);
    // Update sub-inventory quantity
    subInventory.quantity += quantityToIncrease;
    subInventory.lastUpdated = Date.now();
    await subInventory.save({ session });

    // Update main inventory
    mainInventory.quantity -= quantityToIncrease;
    mainInventory.distributed += quantityToIncrease;
    await mainInventory.save({ session });

    await session.commitTransaction();
    session.endSession();
    return subInventory;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error.message || "Could not update sub-inventory by ID");
    throw new Error(error.message || "Could not update sub-inventory by ID");
  }
};
  

