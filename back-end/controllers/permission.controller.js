const {
    getAllPermissions,
    getPermissionByIdd,
    createPermission,
    updatePermission,
    deletePermission,
    getPermissionsByResourceName
} = require("./../services/permission.services")

const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")


const router = require("express").Router();
const express = require("express");


router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

router.get("/getAllPermissions", authenticaiton, authorize("manager"), async (req, res) => {
    try {
        const result = await getAllPermissions();
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(400).send(result.message);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/getById/:id", authenticaiton, authorize("manager"), async (req, res) => {
    try {
        const result = await getPermissionByIdd(req.params.id);
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(400).send(result.message);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post("/add", authenticaiton, authorize("manager"), async (req, res) => {
    try {
        const result = await createPermission(req.body);
        if (result.success) {
            res.status(201).send(result.message);
        } else {
            res.status(400).send(result.message);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put("/edit/:id", authenticaiton, authorize("manager"), async (req, res) => {
    try {
        const result = await updatePermission(req.params.id, req.body);
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(400).send(result.message);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete("/DeleteById/:id", authenticaiton, authorize("manager"), async (req, res) => {
    try {
        const result = await deletePermission(req.params.id);
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(400).send(result.message);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/getByResource/:resourceName", authenticaiton, authorize("manager"), async (req, res) => {
    try {
        const result = await getPermissionsByResourceName(req.params.resourceName);
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(400).send(result.message);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

