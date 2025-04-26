const express = require('express');
const {
  getAllOfflineOrders,
  getAllOrdersByBranchId,
  getOfflineOrderById,
  createOfflineOrder,
  cancelOfflineOrder,
  getBranchById,
  getSubInventoryById,
  deleteProductFromOrder
} = require('../controllers/offline.order.controller');


const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")




const router = express.Router();

// Get all offline orders
router.get('/getAllOfflineOrders', authenticaiton, authorize("manager"),  getAllOfflineOrders);

// Get offline orders by branch ID
router.get('/getOfflineOrdersByBranchId/:branchId', authenticaiton, authorize("cashier"), getAllOrdersByBranchId);

// Get offline order by ID
router.get('/getOfflineOrderbyId/:orderId', authenticaiton, authorize("cashier"), getOfflineOrderById);

// Create a new offline order
router.post('/createOfflineOrder', authenticaiton, authorize("cashier"), createOfflineOrder);




// Cancel an offline order
router.post('/cancelOfflineOrder/:orderId', authenticaiton, authorize("cashier"), cancelOfflineOrder);

// Get branch by ID
router.get('/branch/getBranchById/:branchId', authenticaiton, authorize("cashier"),  getBranchById);

// Get sub-inventory by ID
router.get('/subInventory/getSubInventoryById/:subInventoryId', getSubInventoryById);

// Delete a product from an order
router.post('/deleteProductFromOrder', authenticaiton, authorize("cashier"), deleteProductFromOrder);

module.exports = router;