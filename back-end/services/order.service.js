const {
    getOrders,
    getOrderById: getOrderByIdFromRepo,
    getOrdersByCustomerAndStatus,
    getOrdersByUserId,
    getOrdersByStatus,
    getOrdersByProductId,
    deleteOrder,
    changeOrderStatus,
    createOrder,
    updateOrder,
} = require("../repos/order.repo")

const {
    validateUserId,
    userIsActive
} = require("../services/user.service")

const productRepo = require('../repos/product.repo');

// get all orders
module.exports.getAllOrders = async () => {
    try
    {
        const orders = await getOrders();
        return {success: true, message: orders};
    }catch (error)
    {
        return {success: false, message: error.message};
    }
}


// get order by id
module.exports.getOrderById = async (orderId) => {
    try
    {
        const chk = await validateOrderId(orderId);
        if (!chk.valid)
            return {success:false, message: chk.message};

        return {success:true, message: chk.message};
    }catch (error)
    {
        return {success: false, message: error.message};
    }
}

// get order that relatd to customer with specific status
module.exports.getOrdersByCustomerAndStatus = async (customerId, status) => {
    try
    {
        const chkUser = await validateUserId(customerId);
        if (!chkUser.valid)
            return {success: false, message: chkUser.message};

        if (!status)
            return {success: false, message: "status should be passed"};

        const orders = await getOrdersByCustomerAndStatus(customerId, status);
        return {success: true, message: orders};
    }catch (error)
    {
        return {success: false, message: error.message};
    }
}
// get order by customer id
module.exports.getOrdersByUserId = async (userId) => {
    try{
        const chkUser = await validateUserId(userId);
        if (!chkUser.valid)
            return {success: false, message: chkUser.message};
        const orders = await getOrdersByUserId(userId);
        return {success: true, message: orders};

    }catch (error)
    {
        return {success: false, message: error.message};
    }
}
// get order by status
module.exports.getOrdersByStatus = async (status) => {
    try
    {
        if (!status)
            return {success: false, message: "status should be passed"};

        const orders = await getOrdersByStatus(status);
        return {success: true, message: orders};
    }catch (error)
    {
        return {success: false, message: error.message};
    }
}

// get order by prod



// delete order 
module.exports.deleteOrder = async (orderId) => {
    try
    {
        const chkOrderId = await validateOrderId(orderId);
        if (!chkOrderId.valid)
            return {success: false, message: chkOrderId.message};

        const chkDelete = await deleteOrder(orderId);
        return {success: true, message: chkDelete.message};
    }catch (error)
    {
        return {success: false, message: error.message};
    }
}

// create order 
module.exports.createOrder = async (orderData) => 
{
    try{
        const chkForDataToCreate = await validationOnCreateAndUpdate(orderData);
        if (!chkForDataToCreate.success){
            console.error("❌ Order validation failed:", chkForDataToCreate.message); // ✅ طباعة الخطأ
             return { success: false, message: chkForDataToCreate.message };
1}
        orderData.totalPrice = 0;

        orderData.items.forEach(element => {
            orderData.totalPrice += Number(element.quantity) * Number(element.price);    
        });

        const order = await createOrder(orderData);
        return {success: true, message:order};
    }catch (error)
    {        console.error("❌ Order creation error:", error.message); // ✅ طباعة أي خطأ آخر

        return {success: false, message: error.message};
    }
}

// update Order
// module.exports.updateOrder = async (orderId, orderData) => {
//     try
//     {
//         const chkOrderId = await validateOrderId(orderId);
//         if (!chkOrderId.valid)
//             return {success: false, message: chkOrderId.message};

//         const chkForDataToUpdate = await validationOnCreateAndUpdate(orderData);
//         if (!chkForDataToUpdate.success)
//              return { success: false, message: chkForDataToUpdate.message };
        
//         orderData.totalPrice = 0;

//         orderData.items.forEach(element => {
//             orderData.totalPrice += Number(element.quantity) * Number(element.price);    
//         });


//         const order = await updateOrder(orderId, orderData);


//         return {success: true, message: order};

//     }catch (error)
//     {
//         return {success: false, message: error.message};
//     }
// }



// get order for product 
// module.exports.getOrdersByProductId = async (prodId) => {
//     try
//     {
//         const chkProd = await validateProductId(prodId);
//         if (!chkProd.valid)
//             return {success: false, message: chkProd.message};

//         const orders = await getOrdersByProductId(prodId);
//         return {success:true, message: orders}
//     }catch (error)
//     {
//         return {success: false, message: error.message};
//     }
// }


// change order Status
module.exports.changeOrderStatus = async (orderId, Status)=> {
    try
    {
        const chkOrderId = await validateOrderId(orderId);
        if (!chkOrderId.valid)
            return {success: false, message: chkOrderId.message};

        if (!Status)
            return {success: false, message: "Status Should Be provided"};
        
        const changeStatus = await changeOrderStatus(orderId, Status);

        return {success: true, message: changeStatus};

    }catch (error)
    {
        return {success: false, message: error.message};
    }

}


const validationOnCreateAndUpdate = async (orderData) => {
    const chkCustomerId = await validateUserId(orderData.customerId);

    if (!chkCustomerId.valid)
        return { success: false, message: 'Invalid customerId' };

    if (!chkCustomerId.message.isActive)
        return { success: false, message: 'Customer Not Valid' };
    
    console.log("Sent Email:", orderData.customerDetails.email);
    console.log("DB Email:", chkCustomerId.message.email);


    if (!orderData.customerDetails.email ||  chkCustomerId.message.email != orderData.customerDetails.email)
        return { success: false, message: 'Invalid email address' };


    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        return { success: false, message: 'Items array must be provided and cannot be empty' };
    }

    for (const item of orderData.items) {
        // const chkProdId = await validateProductId(item.productId);
        // if (!chkProdId.valid)
        //     return { success: false, message: 'Invalid productId in items' };

        // if (isNaN(Number(item.price)) || Number(item.price) <= 0) {
        //     return { success: false, message: 'Invalid price in items' };
        // }
        if (isNaN(Number(item.quantity)) || Number(item.quantity) <= 0) {
            return { success: false, message: 'Invalid quantity in items' };
        }
    }

    if (!orderData.customerDetails || !orderData.customerDetails.firstName || !orderData.customerDetails.lastName ||
        !orderData.customerDetails.email || !orderData.customerDetails.phone || 
        !orderData.customerDetails.address || !orderData.customerDetails.address.street ||
        !orderData.customerDetails.address.city || !orderData.customerDetails.address.zipCode) {
        return { success: false, message: 'Invalid customerDetails' };
    }

    if (!orderData.paymentMethod)
        return { success: false, message: 'Payment Method Should be provided' };


    return { success: true, message: 'Validation successful' };
};


const validateProductId = async (prodId) => {
    if (!prodId)
        return {valid: false, message: "product Id Should Be provided"};

    const prod = await productRepo.getProductById(prodId);
    if (!prod)
        return {valid: false, message: "Product not found with the given ID"};

    return {valid: true, message: prod};
}

// validate order Id
const validateOrderId = async (orderId) => {
    if (!orderId)
        return {valid : false,message: "order Id Should be provided"};

    const order = await getOrderByIdFromRepo(orderId);
    if (!order)
        return {valid : false,message: "no Order with that id"};    

    return {valid :true, message: order};
}




