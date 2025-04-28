const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
  status: {
    type: String,
    enum: ["pending", "shipped", "cancelled", "refunded"], 
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "Online"],
    required: true,
  },
  date: { type: Date, required: true, default: Date.now }, 
  customerDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  notes : {type: String}
});

module.exports = mongoose.model("Order", orderSchema);