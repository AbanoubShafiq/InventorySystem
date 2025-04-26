const {
    getAllMainInventory,
    createMainInventory,
    getMainInventoryById,
    updateMainInventoryById,
    deleteMainInventoryById
} = require("./../services/main.inventory.services")
const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")




const router = require("express").Router();
const express = require("express");
router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

router.get("/getAllMainInventory",  authenticaiton, authorize("clerk"),  async (req, res) => {
    try{
        const result = await getAllMainInventory();
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);


    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.post("/createMainInventory",authenticaiton, authorize("manager"), async (req, res) => {
    try{
        const result = await createMainInventory(req.body);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(201).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getMainInventoryById/:id", authenticaiton, authorize("clerk"),  async (req, res) => {
    try{
        const result = await getMainInventoryById(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.put("/updateMainInventoryById/:id",authenticaiton, authorize("manager"), async (req, res) => {
    try{
        const result = await updateMainInventoryById(req.params.id, req.body);
        if (!result.success)
            return res.status(400).json(result.message);
        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.delete("/deleteMainInventory/:id",authenticaiton, authorize("manager"), async (req, res) => {
    try{
        const result = await deleteMainInventoryById(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);
        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})




module.exports = router;
