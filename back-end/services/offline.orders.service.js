const {
    getAllOfflineOrders,
    getAllOrdersByBranchId,
    getOfflineOrderById: getOfflineOrderByIdFromRepo,
    createOfflineOrder,
    cancelOfflineOrder,
    deleteProductFromOrderService
} = require("./../repos/offline.order.repo");

const {getBranchById} = require("./branch.service");

const OfflineOrder = require('../models/offilne.order.model'); // Correct the import statement

module.exports.deleteProductFromOrderService = async (orderId, productId, quantity) => {
    try {
        const order = await OfflineOrder.findById(orderId);
        if (!order) {
            return { success: false, message: 'Order not found' };
        }

        const itemIndex = order.items.findIndex(item => item.subInventoryId === productId);
        if (itemIndex === -1) {
            return { success: false, message: 'Product not found in order' };
        }

        order.items[itemIndex].quantity -= quantity;
        if (order.items[itemIndex].quantity <= 0) {
            order.items.splice(itemIndex, 1);
        }

        await order.save();
        return { success: true, message: 'Product removed from order' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ...existing code...
module.exports.getAllOfflineOrders = async () => {
    try
    {
        const offlineOrders = await getAllOfflineOrders();
        return {success:true, message: offlineOrders}
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.getAllOrdersByBranchId = async (branchId) => {
    try
    {
        if (!branchId)
            return {success: false,message:"Branch Id Should be Passed"};

        const branch = await getBranchById(branchId);
        if(!branch)
            return {success: false,message:"No branch with that Id"};

        const branchOrders = await getAllOrdersByBranchId(branchId);
        return {success: true, message: branchOrders};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.getOfflineOrderById = async (orderId) => {
    try
    {
        const chkOfflineOrder = await validateOfflineOrderId(orderId);
        if(!chkOfflineOrder.valid)
            return {success: false, message: chkOfflineOrder.message};

        return {success: true, message: chkOfflineOrder.message};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.createOfflineOrder = async (orderData) => {
    try
    {
        
        const chk = await validateOnCreateAndUpdate(orderData);
        if (!chk.valid)
            return {success: false, message: chk.message};

        const offlineOrder =await createOfflineOrder(orderData)

        return {success: true, message: offlineOrder};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.cancelOfflineOrder = async (orderId) => {
    try
    {
        const chk = await validateOfflineOrderId (orderId);
        if (!chk.valid)
            return {success: false, message: chk.message};

        if (chk.message.status == "canceled")
            return {success: false, message: "order already canceled"};

        await cancelOfflineOrder(orderId);

        return {success: true, message: "Order Returned Successfully"};
    
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}



const validateOfflineOrderId = async (orderId)=> {
    if (!orderId)
        return {valid: false, message: "Offline Order Id Should Be Passed"};

    const offlineOrder = await getOfflineOrderByIdFromRepo(orderId);

    if(!offlineOrder)
        return {valid: false, message: "No Offline Order With that Id"};

    return {valid: true, message: offlineOrder};
}


const validateOnCreateAndUpdate = async (orderData)=> {

    if (!orderData.items || orderData.items.length == 0)
        return {valid: false, message: "Items Should Be Passed"}

    for(const item of orderData.items)
    {
        if (item.quantity <= 0)
            return {valid: false, message: `Invalid quantity for item in sub-inventory ${item.subInventoryId}`}
    }

    if (!orderData.branch)
        return {valid: false, message: "Branch Should Be Passed"};

    const branchChk = await getBranchById(orderData.branch);
    if(!branchChk)
        return {valid: false, message: "No branch Wtih that Id"};   

    return {valid: true, message: "Validation Passed"};

}


