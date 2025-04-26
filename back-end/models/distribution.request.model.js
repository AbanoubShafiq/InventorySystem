const mongoose = require('mongoose');

const distributionRequestSchema = new mongoose.Schema({
    mainInventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainInventory', // Reference to MainInventory
        required: true
    },
    branchManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model with branchManager role
        required: true
    },
    requestedQuantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const DistributionRequest = mongoose.model('DistributionRequest', distributionRequestSchema);

module.exports = DistributionRequest;
