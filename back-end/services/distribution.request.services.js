const mongoose = require('mongoose');
const { createSubInventory } = require('../repos/sub.inventory.repo');
const {
    getAllDistributionRequests,
    createDistributionRequest,
    getDistributionRequestById:getDistributionRequestByIdFromRepo, 
    updateDistributionRequestStatusAndMessage,
    deleteDistributionRequest,
    getDistributionRequestsByStatus,
    getDistributionRequestsByBranchManager,
    deactiveSubInventory
} = require('../repos/distribution.request.repo');

const {
    getMainInventoryById
} = require("./../repos/main.inventory.repo");


const {
    validateUserId,
} = require("../services/user.service")


module.exports.getAllDistributionRequests = async () => {
    try {
        const distReq = await getAllDistributionRequests();
        return { success: true, message: distReq };
    } catch (error) {
        return {success:false, message: error.message};
    }
};



module.exports.createDistributionRequest = async (data) => {
    try {
        const validation = await validateDistributionRequestData(data);
        console.log(validation);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }
        if (data.status)
            data.status = data.status.toLowerCase();

        const distributionRequest = await createDistributionRequest(data);
        return {success: true, message: distributionRequest};
    } catch (error) {
        return {success: false, message: error.message};
    }
};




// Validation function
const validateDistributionRequestData = async (data) => {
    if (!data.mainInventory) {
        return { valid: false, message: "Main inventory is required" };
    }
    if (!data.branchManager) {
        return { valid: false, message: "Branch manager is required" };
    }
    if (!data.requestedQuantity) {
        return { valid: false, message: "Requested quantity is required" };
    }

    const mainInventoryChk = await getMainInventoryById(data.mainInventory);
    if (!mainInventoryChk) {
        return { valid: false, message: "Main inventory not found" };
    }

    const chkUser = await validateUserId(data.branchManager);
    if (!chkUser.valid)
        return {success: false, message: chkUser.message};

    if (chkUser.message.role !== "clerk")
        return {success: false, message: "Only branch manager can create distribution request"};

    
    if (data.requestedQuantity <= 0) {
        return { valid: false, message: "Requested quantity must be greater than zero" };
    }
    
    if (mainInventoryChk.quantity < data.requestedQuantity) {
        return { valid: false, message: "Insufficient quantity in main inventory" };
    }

    return { valid: true };

};


module.exports.getDistributionRequestById = async (id) => {
    try {
        const chk = await validateDistReqId(id);
        if (!chk.valid) {
            return { success: false, message: chk.message };
        }
        return { success: true, message: chk.message };
    } catch (error) {
        throw new Error("Could not get distribution request by ID: " + error.message);
    }
};


const validateDistReqId = async (distReqId) => {
    if (!distReqId) {
        return { valid: false, message: "Distribution request ID is required" };
    }
    const distReq = await getDistributionRequestByIdFromRepo(distReqId);
    if (!distReq) {
        return { valid: false, message: "Distribution request not found" };
    }
    return { valid: true, message: distReq };
}



module.exports.deleteDistributionRequest = async (id) => {
    try {
        const chk = await validateDistReqId(id);
        if (!chk.valid) {
            return { success: false, message: chk.message };
        }

        if (chk.message.status !== "pending") {
            return { success: false, message: "Only pending distribution requests can be deleted" };
        }

        const deleted = await deleteDistributionRequest(id);
        return { success: true, message: deleted };
        
    } catch (error) {
        throw new Error("Could not delete distribution request: " + error.message);
    }
};



module.exports.getDistributionRequestsByStatus = async (status) => {
    try {
        if (!status)
            return { success: false, message: "Status is required" };
        status = status.toLowerCase();
        const distReqs = await getDistributionRequestsByStatus(status);
        return {success: true, message: distReqs};
    } catch (error) {
        throw new Error("Could not get distribution requests by status: " + error.message);
    }
};



module.exports.updateDistributionRequestStatusAndMessage = async (id, status, message) => {



    try {
        const chk = await validateDistReqId(id);
        if (!chk.valid) {
            return { success: false, message: chk.message };
        }
        const distReq = await updateDistributionRequestStatusAndMessage(id, status, message);
        return { success: true, message: distReq };
        return {status: true, message: distributionRequest};
    } catch (error) {
        return {status: false, message: error.message};
    }
};


module.exports.getDistributionRequestsByBranchManager = async (branchManagerId) => {
    try {
        const chkUser = await validateUserId(branchManagerId);
        if (!chkUser.valid)
            return {success: false, message: chkUser.message};
        if (chkUser.message.role !== "clerk")
            return {success: false, message: "Only branch manager can get distribution requests"};
        const distReqs = await getDistributionRequestsByBranchManager(branchManagerId);
        return {success: true, message: distReqs};
    } catch (error) {
        return {success: false, message: error.message};
    }
};




