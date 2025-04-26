const {
    createProductRequest,
    getAllProductRequests,
    getProductRequestById: getProductRequestByIdFromRepo,
    getProductRequestsForSeller,
    deleteProductRequest,
    updateProductRequestStatusAndMessage
} = require("./../repos/product.request.repo")


const {
    getProductById
} = require("./../repos/product.repo");


const {getUserById} = require("./../repos/user.repo");
const { valid } = require("joi");


module.exports.createProductRequest = async (data) => {
    try {
        const validation = await validationOnCreateProductRequest(data);
        console.log(validation);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }
        if (data.status)
            data.status = data.status.toLowerCase();

        const request = await createProductRequest(data);
        return {success: true, message: request};
    } catch (error) {
        return {success: false, message: error.message};    
    }
}


const validationOnCreateProductRequest = async (data) => {
    const { product, seller, superAdmin, requestedQuantity } = data;

    if (!product) {
        return { valid: false, message: "Product is required" };
    }
    if (!seller) {
        return { valid: false, message: "Seller is required" };
    }
    if (!superAdmin) {
        return { valid: false, message: "SuperAdmin is required" };
    }
    if (!requestedQuantity) {
        return { valid: false, message: "Requested quantity is required" };
    }

    const productChk = await getProductById(product);
    if (!productChk) {
        return { valid: false, message: "Product not found" };
    }

    const sellerChk = await getUserById(seller);
    if (!sellerChk) {
        return { valid: false, message: "Seller not found" };
    }

    const superAdminChk = await getUserById(superAdmin);
    if (!superAdminChk) {
        return { valid: false, message: "SuperAdmin not found" };
    }

    if (typeof requestedQuantity !== 'number' || requestedQuantity <= 0) {
        return { valid: false, message: "Requested quantity must be a positive number" };
    }


    return { valid: true , message : "valiation passed"};   
}

module.exports.getAllProductRequests = async () => {
    try {
        const requests = await getAllProductRequests();
        return {success: true, message: requests};
    } catch (error) {
        return {success: false, message: error.message};
    }
}


const validateProdReqId = async (id) => {
    if (!id) {
        return { valid: false, message: "Product request ID is required" };
    }
    const chk = await getProductRequestByIdFromRepo(id);
    if (!chk) {
        return { valid: false, message: "Product request not found" };
    }
    return { valid: true, message:chk };
}


module.exports.getProductRequestById = async (id) => {
    try {
        const validation = await validateProdReqId(id);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }
        return { success: true, message: validation.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
}




module.exports.getProductRequestsForSeller = async (sellerId) => {
    try {
        if (!sellerId) {
            return { success: false, message: "Seller ID is required" };
        }

        const chk = await getUserById(sellerId);
        if (!chk) {
            return { success: false, message: "Seller not found" };
        }

        const requests = await getProductRequestsForSeller(sellerId);
        return { success: true, message: requests };
    } catch (error) {
        return { success: false, message: error.message };
    }
}


module.exports.deleteProductRequest = async (id) => {
    try {
        const validation = await validateProdReqId(id);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        if (validation.message.status !== 'pending') {
            return { success: false, message: "Product request cannot be deleted" };
        }

        const deleted = await deleteProductRequest(id);
        return { success: true, message: deleted };
    } catch (error) {
        return { success: false, message: error.message };
    }
}



module.exports.updateProductRequestStatusAndMessage = async (id, changedStatus, msg) => {
    try {
        const validation = await validateProdReqId(id);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        if (!changedStatus) {
            return { success: false, message: "Status is required" };
        }

        changedStatus = changedStatus.toLowerCase();

        if (changedStatus === validation.message.status) {
            return { success: true, message: "Status is already " + changedStatus };
        }

        if (validation.message.status !== 'pending') {
            return { success: false, message: "Product request status cannot be changed" };
        }

        if (changedStatus !== 'approved' && changedStatus !== 'rejected') {
            return { success: false, message: "Invalid status" };
        }

        if (changedStatus === 'approved') {
            if (validation.message.requestedQuantity > validation.message.product.quantity) {
                return { success: false, message: "Requested quantity is greater than available quantity" };
            }
        }
        
    
        const updated = await updateProductRequestStatusAndMessage(id, changedStatus, msg);
        return { success: true, message: updated };
    } catch (error) {
        return { success: false, message: error.message };
    }
}