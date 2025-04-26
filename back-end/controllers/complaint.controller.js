const express = require('express');

const {
    createComplaint,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    changeComplaintStatus,
    getComplaintsByUser,
    getAllComplaints,
    getComplaintsForCustomersAndGuest
} = require("./../services/complaint.service");
const router = express.Router();

const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")


router.get("/getComplaintsForCustomersAndGuest" , authenticaiton, authorize("clerk"), async (req, res) => {
    try {
        const result = await getComplaintsForCustomersAndGuest();

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(result.message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




// Create a new complaint
router.post('/', async (req, res) => {
    try {
        const result = await createComplaint(req.body);
        if (result.success) {
            res.status(201).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a complaint by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await getComplaintById(req.params.id);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(result.message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a complaint
router.put('/:id', authenticaiton, authorize("customer"), async (req, res) => {
    try {
        const result = await updateComplaint(req.params.id, req.body);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(result.message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a complaint
router.delete('/:id', authenticaiton, authorize("customer"), async (req, res) => {
    try {
        const result = await deleteComplaint(req.params.id);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json({ message: result.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Change complaint status
router.put('/status/:id', authenticaiton, authorize("clerk"), async (req, res) => {
    try {

        const result = await changeComplaintStatus(req.params.id, req.body.status);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(result.message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get complaints by user
router.get('/user/:userId',  authenticaiton, authorize("customer"), async (req, res) => {
    try {
        const result = await getComplaintsByUser(req.params.userId);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(result.message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all complaints
router.get('/',  authenticaiton, authorize("manager"), async (req, res) => {
    try {
        const result = await getAllComplaints();
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(result.message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





module.exports = router;
