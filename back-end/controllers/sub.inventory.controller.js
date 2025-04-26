const {
    getAllSubInventories,
    createSubInventory,
    getSubInventoryById,
    getSubInventoriesByBranchName,
    getActiveSubInventoriesByBranchName,
    getDeactiveSubInventoriesByBranchName,
    activeSubInventory,
    deactiveSubInventory,
    deleteSubInventory,
    decreaseSubInventoryQuantity,
    increaseSubInventoryQuantity,
    getSubInventoriesByBranchId,
    getDeactiveSubInventoriesByBranchId,
    getActiveSubInventoriesByBranchId,

} = require("./../services/sub.inventory.services");

const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")


const router = require("express").Router();
const express = require("express");
router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));


router.get("/getAllSubInventories",authenticaiton, authorize("manager"), async (req, res) => {
    try{
        const result = await getAllSubInventories();
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);


    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.post("/CreateSubInventory", authenticaiton, authorize("manager"), async (req, res) => {
    try{
        const result = await createSubInventory(req.body);
        // console.log(result)
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(201).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getSubInventoryById/:id", async (req, res) => {
    try{
        const result = await getSubInventoryById(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getSubInventoriesByBranchName/:branchName", authenticaiton, authorize("clerk"), async(req, res) => {
    try{
        const result = await getSubInventoriesByBranchName(req.params.branchName);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getActiveSubInventoriesByBranchName/:branchName",  async(req, res) => {
    try{
        const result = await getActiveSubInventoriesByBranchName(req.params.branchName);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getDeactiveSubInventoriesByBranchName/:branchName", authenticaiton, authorize("clerk"), async(req, res) => {
    try{
        const result = await getDeactiveSubInventoriesByBranchName(req.params.branchName);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getDeactiveSubInventoriesByBranchId/:id", authenticaiton, authorize("clerk"), async(req, res) => {
    try{
        const result = await getDeactiveSubInventoriesByBranchId(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get("/getActiveSubInventoriesByBranchId/:id", async(req, res) => {
    try{
        const result = await getActiveSubInventoriesByBranchId(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})






router.post("/activeSubInventory/:id", authenticaiton, authorize("clerk"), async(req, res) => {
    try{
        const result = await activeSubInventory(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.post("/deactiveSubInventory/:id", authenticaiton, authorize("clerk"),  async(req, res) => {
    try{
        const result = await deactiveSubInventory(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.delete("/deleteSubInventory/:id", authenticaiton, authorize("clerk"), async(req, res) => {
    try{
        const result = await deleteSubInventory(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.put("/decreaseSubInventoryQuantity/:id", authenticaiton, authorize("manager"), async (req, res) => {
    try{
        const result = await decreaseSubInventoryQuantity(req.params.id, req.body.quantityToDecrease);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.put("/increaseSubInventoryQuantity/:id", authenticaiton, authorize("manager"), async (req, res) => {
    try{
        const result = await increaseSubInventoryQuantity(req.params.id, req.body.quantityToIncrease);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get("/getSubInventoriesByBranchId/:branchId",authenticaiton, authorize("clerk"), async(req, res) => {
    try{
        const result = await getSubInventoriesByBranchId(req.params.branchId);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
}
)






module.exports = router;