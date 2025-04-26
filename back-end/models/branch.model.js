const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    branchName: { type: String, required: true, trim: true },
    location: { 
        type: String, 
        trim: true, 
        validate: {
            validator: function(value) {
                return this.type === "offline" ? Boolean(value) : true;
            },
            message: "Location is required for offline branches."
        }
    },
    contactNumber: { 
        type: String, 
        validate: {
            validator: function(v) {
                return /^(\+?\d{1,3}[-.\s]?)?\d{10}$/.test(v);
            },
            message: "Invalid contact number format."
        }
    },
    type: { type: String, enum: ["offline", "online"], required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Branch = mongoose.model("Branch", branchSchema);
module.exports = Branch;
