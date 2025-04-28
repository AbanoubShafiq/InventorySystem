const {
    createReview,
    getReviewsByProduct,
    deleteReview,
    getReviewById,
    getReviewsByUser
} = require("./../services/product.review.services");


const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")

const router = require("express").Router();
const express = require("express");
router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

router.post("/createReview",authenticaiton, authorize("customer"), async (req, res) => {
    try {
        const result = await createReview(req.body);
        if (result.success) {
            res.status(201).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/getReviewsByProduct/:productId", async (req, res) => {
    try {
        const productId = req.params.productId;
        const result = await getReviewsByProduct(productId);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);


router.delete("/deleteReview/:reviewId",authenticaiton, authorize("cashier"), async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const result = await deleteReview(reviewId);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);


router.get("/getReviewById/:reviewId", async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const result = await getReviewById(reviewId);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);



router.get("/getReviewsByUser/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await getReviewsByUser(userId);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;






