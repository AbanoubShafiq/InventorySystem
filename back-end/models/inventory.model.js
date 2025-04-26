const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  supplierId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Supplier", 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
});


module.exports = mongoose.model("Inventory", inventorySchema);