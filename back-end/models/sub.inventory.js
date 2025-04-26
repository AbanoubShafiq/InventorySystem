const mongoose = require('mongoose');

const subInventorySchema = new mongoose.Schema({
  mainInventory: { type: mongoose.Schema.Types.ObjectId, ref: 'MainInventory', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  quantity: { type: Number, required: true },
  numberOfSales: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }  
});

const SubInventory = mongoose.model('SubInventory', subInventorySchema);
module.exports = SubInventory;
