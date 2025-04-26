const mongoose = require("mongoose");

// const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    default: "customer",
    enum: ["customer", "seller", "admin", "manager", "clerk", "cashier"],
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
  contactNo: { type: String },
  image: [{ type: String }],
  isActive: { type: Boolean, default: true },
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const hash = await bcrypt.hash(candidatePassword, this.salt);
  return hash == this.password;
};


module.exports = mongoose.model("User", userSchema);