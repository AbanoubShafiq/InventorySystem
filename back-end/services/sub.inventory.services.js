const {
    getAllSubInventories,
    createSubInventory,
    getSubInventoryById:getSubInventoryByIdFromRepo ,
    getSubInventoriesByBranchName,
    getActiveSubInventoriesByBranchName,
    getDeactiveSubInventoriesByBranchName,
    activeSubInventory,
    deactiveSubInventory,
    deleteSubInventory,
    decreaseSubInventoryQuantity,
    increaseSubInventoryQuantity,
    getDeactiveSubInventoriesByBranchId,
    getActiveSubInventoriesByBranchId
    
} = require("./../repos/sub.inventory.repo");

const {
    getMainInventoryById
} = require("./../services/main.inventory.services");

const {
    getBranchById,
    getBranchByName
} = require("./branch.service")

const {getProductById} = require("./../repos/product.repo")

module.exports.getAllSubInventories = async () => {
    try
    {
        const SubInventories = await getAllSubInventories();
        return {success:true, message: SubInventories}
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.createSubInventory = async (data) => {
    try
    {
        const dataChk = await validateCreateAndUpdateData(data);
        if (!dataChk.valid)
            return {success: false, message: dataChk.message};
        const subInventory = await createSubInventory(data);
        return {success:true, message: subInventory}
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

const validateCreateAndUpdateData = async (data) => 
{
    if (!data.mainInventory)
        return {valid: false, message: "Main Inventory Data Should Be passed"};
    const mInventorychk = await getMainInventoryById(data.mainInventory);
    if (!mInventorychk.success)
        return {valid: false, message: "No Main Inventory with the id Passed"};

    

    if (data.quantity > mInventorychk.message.quantity || data.quantity <= 0)
        return {valid: false, message: "Invalid Quantity"};

    if (!data.product)
        return {valid: false, message: "Product Data Should Be passed"};

    const prodChk = await getProductById(data.product);
    if (!prodChk)
        return {valid: false, message: "No Product with the given id"};

    if (!prodChk.isActive)
        data.active = false;

    if (!data.branch)
        return {valid: false, message: "Branch Should Be Passed"};

    const branch = await getBranchById(data.branch);
    
    if (!branch)
        return {valid: false, message: "No Branch With that Id"};


    return {valid: true, message: "Validation Passed Successfully"};        
}


module.exports.getSubInventoryById = async (id) => {
    try
    {
        const chk = await validateSubInventoryId(id);
        if (!chk.valid)
            return {success: false, message: chk.message};

        return {success: true, message: chk.message};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.getSubInventoriesByBranchName = async (branchName) => {
    try
    {
        const chk = await validateBrancName(branchName);
        if (!chk.valid)
            return {success: false, message: chk.message};

        const subInventories = await getSubInventoriesByBranchName(chk.message._id);
        
        return {success: true, message: subInventories};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.getSubInventoriesByBranchId = async (branchId) => {
    try
    {
        const chk = await validationONBranchId(branchId);
        if (!chk.valid)
            return {success: false, message: chk.message};
        
        const subInventories = await getSubInventoriesByBranchName(branchId);
        return {success: true, message: subInventories};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

const validationONBranchId = async (branchId) => {
    if (!branchId)
        return {valid: false, message: "Branch Id Should Be Passed"};

    const branch = await getBranchById(branchId);
    if (!branch)
        return {valid: false, message: "No Branch With that Id"};

    return {valid: true, message: branch};
}



module.exports.getActiveSubInventoriesByBranchName = async (branchName) => {
    try
    {
        const chk = await validateBrancName(branchName);
        if (!chk.valid)
            return {success: false, message: chk.message};


        const subInventories = await getActiveSubInventoriesByBranchName(chk.message._id);
        
        return {success: true, message: subInventories};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.getDeactiveSubInventoriesByBranchName = async (branchName) => {
    try
    {
        const chk = await validateBrancName(branchName);
        if (!chk.valid)
            return {success: false, message: chk.message};


        const subInventories = await getDeactiveSubInventoriesByBranchName(chk.message._id);
        
        return {success: true, message: subInventories};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.getDeactiveSubInventoriesByBranchId = async (branchId) => {
    try
    {
        const chk = await validationONBranchId(branchId);
        if (!chk.valid)
            return {success: false, message: chk.message};

        const subInventories = await getDeactiveSubInventoriesByBranchId(chk.message._id);
        
        return {success: true, message: subInventories};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.getActiveSubInventoriesByBranchId = async (branchId) => {
    try
    {
        const chk = await validationONBranchId(branchId);
        if (!chk.valid)
            return {success: false, message: chk.message};

        const subInventories = await getActiveSubInventoriesByBranchId(chk.message._id);
        
        return {success: true, message: subInventories};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}






module.exports.activeSubInventory = async (subInventoryId) => {
    try
    {
        const chk = await validateSubInventoryId(subInventoryId);
        if (!chk.valid)
            return {success: false, message: chk.message};

        
        if (!chk.message.product.isActive)
            return {success: false, message: "Product is not active "};


        const Inventory = await activeSubInventory(chk.message._id);
        return {success: true, message: Inventory};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.deactiveSubInventory = async (subInventoryId) => {
    try
    {
        const chk = await validateSubInventoryId(subInventoryId);
        if (!chk.valid)
            return {success: false, message: chk.message};



        const Inventory = await deactiveSubInventory(chk.message._id);
        return {success: true, message: Inventory};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.deleteSubInventory = async (subInventoryId) => {
    try
    {
        const chk = await validateSubInventoryId(subInventoryId);
        if (!chk.valid)
            return {success: false, message: chk.message};

        if (chk.message.numberOfSales > 0)
            return {success: false, message: "Cannot delete sub-inventory with sales "};

        const inventory = await deleteSubInventory(subInventoryId);
        return {success: true, message: inventory};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.decreaseSubInventoryQuantity = async (id, quantityToDecrease)=> {
    try
    {
        const chk = await validateSubInventoryId(id);
        if (!chk.valid)
            return {success: false, message: chk.message};

        if (!quantityToDecrease)
            return {success: false, message: "Quantity To Decrease Should Be Passed"};
            
        if (chk.message.quantity < quantityToDecrease || quantityToDecrease <= 0)
            return {success: false, message: "Insufficient quantity in sub-inventory "};

        const adjustedInventory = await decreaseSubInventoryQuantity(id, quantityToDecrease);

        return {success: true , message: adjustedInventory};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.increaseSubInventoryQuantity = async (id, quantityToIncrease)=> {
    try
    {
        const chk = await validateSubInventoryId(id);
        if (!chk.valid)
            return {success: false, message: chk.message};

        if (!quantityToIncrease)
            return {success: false, message: "Quantity To Increase Should Be Passed"};
            
        if (chk.message.mainInventory.quantity < quantityToIncrease || quantityToIncrease <= 0)
            return {success: false, message: "Insufficient quantity in sub-inventory "};

        const adjustedInventory = await increaseSubInventoryQuantity(id, quantityToIncrease);

        return {success: true , message: adjustedInventory};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}





const validateBrancName = async (branchName) => {
    if (!branchName)
        return {valid: false, message: "Branch Name should be passed"};

    const branch = await getBranchByName(branchName);
    if (!branch)
        return {valid: false, message: "No Branch With that name"};

    return {valid: true, message: branch};

}

const validateSubInventoryId = async (id) => {
    if (!id)
        return {valid: false, message: "Id Should Be Passed"};

    const subInventory = await getSubInventoryByIdFromRepo(id);
    if (!subInventory)
        return {valid: false, message: "No Inventory with that id"};

    return {valid: true, message: subInventory};

}