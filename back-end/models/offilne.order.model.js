const mongoose = require('mongoose');

const offlineOrderSchema = new mongoose.Schema({
    items: [
      {
        subInventoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubInventory",
          required: true,
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true }, 
    date: { type: Date, required: true, default: Date.now }, 
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'canceled'],
      required: true,
      default: 'completed'
    }
  });
  
module.exports = mongoose.model('OfflineOrder', offlineOrderSchema);