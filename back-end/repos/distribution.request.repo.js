const mongoose = require('mongoose');
const DistributionRequest = require('../models/distribution.request.model');
const subInventoryService = require("./../services/sub.inventory.services")


module.exports.createDistributionRequest = async (data) => {
    try {
        const distributionRequest = await DistributionRequest.create(data);
        return distributionRequest;
    } catch (error) {
        throw new Error("Could not create distribution request");
    }
};


module.exports.getDistributionRequestById = async (id) => {
    try {
        const distributionRequest = await DistributionRequest.findById(id)
            .populate('mainInventory branchManager')
            .exec();
        return distributionRequest;
    } catch (error) {
        throw new Error("Could not get distribution request by ID");
    }
};




module.exports.updateDistributionRequestStatusAndMessage = async (id, changedStatus, msg) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const distributionRequest = await DistributionRequest.findById(id)
        .populate({
          path: 'mainInventory',
          populate: {
            path: 'product' // Populate the product inside mainInventory
          }
        })
        .populate('branchManager'); // Keep other population as needed
      
        
        if (!distributionRequest) {
            throw new Error("Distribution request not found");
        }

        if (distributionRequest.status === changedStatus) {
            throw new Error(`Distribution request is already ${changedStatus}`);
        }

        if (distributionRequest.status !== "pending" && (changedStatus === "approved" || changedStatus === "rejected")) {
            throw new Error(`Cannot change status from ${distributionRequest.status} to ${changedStatus}`);
        }

        distributionRequest.status = changedStatus;
        distributionRequest.message = msg;
        await distributionRequest.save({ session });

        if (changedStatus === "approved") {
            const subInventoryData = {
                mainInventory: distributionRequest.mainInventory,
                branch: distributionRequest.branchManager.branch._id,
                quantity: distributionRequest.requestedQuantity,
                product: distributionRequest.mainInventory.product // Access the populated product data
            };

            const chk = await subInventoryService.createSubInventory(subInventoryData, session);
            if (!chk.success) {
                throw new Error(chk.message);
            }

            console.log(chk);
        }

        await session.commitTransaction();
        return distributionRequest;
    } catch (error) {
        await session.abortTransaction();
        throw new Error("Could not update distribution request status and message: " + error.message);
    } finally {
        session.endSession();
    }
};




module.exports.deleteDistributionRequest = async (id) => {
    try {
        await DistributionRequest.findByIdAndDelete(id);
        return { message: "Distribution request deleted successfully" };
    } catch (error) {
        throw new Error("Could not delete distribution request");
    }
};

module.exports.getAllDistributionRequests = async () => {
    try {
        const distributionRequests = await DistributionRequest.find()
            .populate('mainInventory branchManager')
            .exec();
        return distributionRequests;
    } catch (error) {
        throw new Error("Could not get all distribution requests");
    }
};

module.exports.getDistributionRequestsByStatus = async (requestStatus) => {
    try {
        console.log(requestStatus)
        const distributionRequests = await DistributionRequest.find({ status: requestStatus })
            .populate('mainInventory branchManager')
            .exec();
        return distributionRequests;
    } catch (error) {
        throw new Error("Could not get distribution requests by status");
    }
};


module.exports.getDistributionRequestsByBranchManager = async (branchManagerId) => {
    try {
        const distributionRequests = await DistributionRequest.find({ branchManager: branchManagerId })
            .populate('mainInventory branchManager')
            .exec();
        return distributionRequests;
    } catch (error) {
        throw new Error("Could not get distribution requests by branch manager");
    }
};