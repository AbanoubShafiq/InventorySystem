const {
    getAllMainInventory,
    getMainInventoryById,
    createMainInventory,
    updateMainInventoryById,
    deleteMainInventoryById,

} = require("./../repos/main.inventory.repo")

const {getProductById} = require("./../repos/product.repo")

// get all inventories
module.exports.getAllMainInventory = async () => {
    try
    {
        const MainInventories = await getAllMainInventory();
        return {success:true, message: MainInventories}
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


const validateCreateAndUpdateMainInventory = async (data) => {
    if (!data.product)
        return {valid: false, message: "Product Should Be Passed"};

    const prod = await getProductById(data.product);

    if (!prod)
        return {valid: false, message: "No Product With that Id"};

    // check qunatity
    if (!data.quantity || data.quantity <= 0)
        return {valid: false, message: "Enter Valid Quantity"};

    return {valid: true, message: prod}

}

const validationMainInventoryId = async (id) => {
    if (!id)
        return {valid: false, message: "InventoryId Should Be Passed"};

    const inventory = await getMainInventoryById(id);
    if (!inventory)
        return {valid: false, message: "No Inventory With That Id"};

    return {valid: true, message: "All Validation passed"};

}


module.exports.createMainInventory = async (data) => {
    try
    {
        const chk = await validateCreateAndUpdateMainInventory(data);

        if (!chk.valid)
            return {success: false, message: chk.message};

        
        if (chk.message.quantity < data.quantity)
        {
            return {success: false, message: "Enter Valid Quantity"};
        }
        
        // check prod Existance 
        const mInventory = await createMainInventory(data);
        return {success: true, message: mInventory};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}




module.exports.updateMainInventoryById = async (id, data) => {
    try
    {
        const chkForId = await validationMainInventoryId(id);
        console.log(chkForId);
        if (!chkForId.valid)
            return {success: false, message: chkForId.message};

        const chk = await validateCreateAndUpdateMainInventory(data);
        if (!chk.valid)
            return {success: false, message: chk.message};

        const inventory = await updateMainInventoryById(id, data);
        return {success: true, message: inventory};
        
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.getMainInventoryById = async (id) => {
    try
    {
        const chk = await validationMainInventoryId(id);
        if (!chk.valid)
            return {success:false, message: chk.message};
        
        const inventory = await getMainInventoryById(id);
        return {success:true, message: inventory};
            
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.deleteMainInventoryById = async (id) => {
    try
    {
        const chk = await validationMainInventoryId(id);
        if (!chk.valid)
            return {success:false, message: chk.message};
        
        const inventory = await deleteMainInventoryById(id);
        return {success: true, message: inventory};

    }catch (error)
    {
        return {success:false, message: error.message};
    }
}