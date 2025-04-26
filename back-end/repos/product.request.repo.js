const mongoose = require('mongoose');
const ProductRequest = require('../models/product.request.model');



module.exports.createProductRequest = async (data) => {
    try {
        const productRequest = await ProductRequest.create(data);
        return productRequest;
    } catch (error) {
        throw new Error('Error creating product request: ' + error.message);
    }
};


module.exports.getAllProductRequests = async () => {
    try {
        const productRequests = await ProductRequest.find().populate('product seller superAdmin');
        return productRequests;
    } catch (error) {
        throw new Error('Error fetching product requests: ' + error.message);
    }
};


module.exports.getProductRequestById = async (id) => {
    try {
        const productRequest = await ProductRequest.findById(id).populate('product seller superAdmin');

        return productRequest;
    } catch (error) {
        throw new Error('Error fetching product request: ' + error.message);
    }
};


module.exports.getProductRequestsForSeller = async (sellerId) => {
    try {
        const productRequests = await ProductRequest.find({ seller: sellerId }).populate('product seller superAdmin');
        return productRequests;
    } catch (error) {
        throw new Error('Error fetching product requests: ' + error.message);
    }
};


module.exports.deleteProductRequest = async (id) => {
    try {
        const productRequest = await ProductRequest.findByIdAndDelete(id);

        return productRequest;
    } catch (error) {
        throw new Error('Error deleting product request: ' + error.message);
    }
};


module.exports.updateProductRequestStatusAndMessage = async (id, changedStatus, msg) => {
    try {
        const productRequest = await ProductRequest.findByIdAndUpdate(
            id,
            { status: changedStatus, message: msg },
            { new: true }
        );
        if (!productRequest) {
            throw new Error('Product request not found');
        }
        return productRequest;
    } catch (error) {
        throw new Error('Error updating product request: ' + error.message);
    }
};

