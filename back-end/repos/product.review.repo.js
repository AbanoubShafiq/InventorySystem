const mongoose = require('mongoose');

const Review = require("./../models/product.review.model");


module.exports.createReview = async (data) => {
    try {
        const review = await Review.create(data);
        return review;
    } catch (error) {
        throw new Error('Error creating review: ' + error.message);
    }
};

module.exports.getReviewsByProduct = async (productId) => {
    try {
        const reviews = await Review.find({ product: productId }).populate('customer', 'firstName');
        return reviews;
    } catch (error) {
        throw new Error('Error fetching reviews: ' + error.message);
    }
};



module.exports.deleteReview = async (reviewId) => {
    try {
        const review = await Review.findByIdAndDelete(reviewId);
        return review;
    } catch (error) {
        throw new Error('Error deleting review: ' + error.message);
    }
};


module.exports.getReviewById = async (reviewId) => {
    try {
        const review = await Review.findById(reviewId).populate('customer', 'name');
        return review;
    } catch (error) {
        throw new Error('Error fetching review: ' + error.message);
    }
};


module.exports.deleteReview = async (reviewId) => {
    try {
        const review = await Review.findByIdAndDelete(reviewId);
        return review;
    } catch (error) {
        throw new Error('Error deleting review: ' + error.message);
    }
};


module.exports.getReviewsByUser = async (userId) => {
    try {
        const reviews = await Review.find({ customer: userId }).populate('product', 'name');
        return reviews;
    } catch (error) {
        throw new Error('Error fetching reviews by user: ' + error.message);
    }
};

