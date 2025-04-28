const mongoose = require('mongoose');

const productRequestSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    superAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
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
        type: String,
        default: ''
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

const ProductRequest = mongoose.model('ProductRequest', productRequestSchema);

module.exports = ProductRequest;
