


const {
    getAllProducts,
    getActiveProducts,
    getDeactivatedProducts,
    getProductById,
    createProduct,
    updateProduct,
    activeProduct,
    deactiveProduct,
    deleteProduct,
    getProductsByCategory
} = require("./../services/product.service")

const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")



const router = require("express").Router();
const express = require("express");
router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));


router.get("/getAllProducts", authenticaiton, authorize("manager"), async (req, res) => {
    try{
        const result = await getAllProducts();
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getActiveProducts", authenticaiton, authorize("manager"), async (req, res) => {
    try{
        const result = await getActiveProducts();
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getDeactivatedProducts", authenticaiton, authorize("manager"), async (req, res) => {
    try{
        const result = await getDeactivatedProducts();
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getProductById/:id", authenticaiton, authorize("seller"), async (req, res) => {
    try{
        const result = await getProductById(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.post("/createProduct", authenticaiton, authorize("seller"), async (req, res) => {
    try{
        const result = await createProduct(req.body);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(201).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.put("/updateProduct/:id",authenticaiton, authorize("seller"), async (req, res) => {
    try{
        const result = await updateProduct(req.params.id, req.body);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.post("/activeProduct/:id",authenticaiton, authorize("seller"), async (req, res) => {
    try{
        const result = await activeProduct(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.post("/deactiveProduct/:id",authenticaiton, authorize("seller"), async(req, res) => {
    try{
        const result = await deactiveProduct(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);
    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.delete("/deleteProduct/:id",authenticaiton, authorize("seller"), async (req, res) => {
    try{
        const result = await deleteProduct(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);
    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getProductsByCategory/:id",authenticaiton, authorize("manager"), async (req, res) => {
    try{
        const result = await getProductsByCategory(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);
    } catch (error) {
        res.status(500).send(error.message);
    }
})


module.exports = router;


