const {
    deleteReview,
    getReviewsByProduct,
    getReviewById: getReviewByIdFromRepo,
    createReview,
    getReviewsByUser
} = require("./../repos/product.review.repo");

const {getProductById} = require("./../repos/product.repo")
const {getUserById} = require("./../repos/user.repo");

module.exports.createReview = async (reviewData) => {
    try {
        const validation = await validateReviewData(reviewData);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }
        const review = await createReview(reviewData);
        return { success: true, message: review };
    } catch (error) {
        return { success: false, message: error.message };
    }
}



const validateReviewData = async (reviewData) => {
    const { product, customer, rating, comment } = reviewData;
    if (!product) {
        return { valid: false, message: "Product is required" };
    }

    const prodChk = await getProductById(product);
    if (!prodChk) {
        return { valid: false, message: "Product not found" };
    }

    if (!customer) {
        return { valid: false, message: "Customer is required" };
    }

    const customerChk = await getUserById(customer);
    if (!customerChk) {
        return { valid: false, message: "Customer not found" };
    }

    if (!rating) {
        return { valid: false, message: "Rating is required" };
    }
    if (!comment) {
        return { valid: false, message: "Comment is required" };
    }
    if (rating < 1 || rating > 5) {
        return { valid: false, message: "Rating must be between 1 and 5" };
    }
    return { valid: true };
}




module.exports.getReviewsByProduct = async (productId) => {
    try {
        if (!productId)
            return { success: false, message: "Product ID is required" };
        const prodChk = await getProductById(productId);
        if(!prodChk)
            return { success: false, message: "Product not found" };

        const reviews = await getReviewsByProduct(productId);
        return { success: true, message: reviews };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

const validateOnReviewId = async (reviewId) => {

    if (!reviewId) {
        return { valid: false, message: "Review ID is required" };
    }
    const review = await getReviewByIdFromRepo(reviewId);
    if (!review) {
        return { valid: false, message: "Review not found" };
    }
    return { valid: true, message: review };

}



module.exports.deleteReview = async (id) => {
    try {
        const validation = await validateOnReviewId(id);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }
        await deleteReview(id);
        return { success: true, message: "Review deleted successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}










module.exports.getReviewById = async (id) => {
    try {
        const validation = await validateOnReviewId(id);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }
        return {success: true, message: validation.message};
    } catch (error) {
        return { success: false, message: error.message };
    }
}

module.exports.getReviewsByUser = async (userId) => {
    try {
        if (!userId)
            return { success: false, message: "User ID is required" };
        const user = await getUserById(userId);
        if(!user)
            return { success: false, message: "User not found" };

        const reviews = await getReviewsByUser(userId);
        return { success: true, message: reviews };
    } catch (error) {
        return { success: false, message: error.message };
    }
}







