const mongoose = require("mongoose");

const mainInventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  distributed: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const MainInventory = mongoose.model('MainInventory', mainInventorySchema);
module.exports = MainInventory;
