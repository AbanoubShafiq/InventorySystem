const  {
    getAllComplaints,
    createComplaint,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    changeComplaintStatus,
    getComplaintsByUser,
    getComplaintsForCustomersAndGuest
} = require("./../repos/complaint.repo")

const {
    validateUserId,
} = require("../services/user.service");

const { getUserById } = require("../repos/user.repo");


const validateComplaintData = async (data) => {
    try {
        const { user, email, subject, description } = data;

        if (!user && !email) {
            return { valid: false, message: "Either user or email must be provided" };
        }

        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            return { valid: false, message: "Please enter a valid email address" };
        }

        if (!subject || subject.trim() === "") {
            return { valid: false, message: "Subject is required" };
        }

        if (!description || description.trim() === "") {
            return { valid: false, message: "Description is required" };
        }

        return { valid: true };
    } catch (error) {
        return { valid: false, message: error.message };
    }
};

module.exports.createComplaint = async (complaintData) => {
    try {
        const validation = await validateComplaintData(complaintData);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        const newComplaint = await createComplaint(complaintData);
        return { success: true, message: newComplaint };
    } catch (error) {
        return { success: false, message: "Faild to Create Complaint" };
    }
};

module.exports.updateComplaint = async (complaintId, updateData) => {
    try {
        const validation = await validateId(complaintId);
        if (!validation.valid) {
            return {success: false, message: validation.message};
        }

        const dataValidation = await validateComplaintData(updateData);
        if (!dataValidation.valid) {
            return { success: false, message: dataValidation.message };
        }

        const updatedComplaint = await updateComplaint(complaintId, updateData);
        return { success: true, message: updatedComplaint };
    } catch (error) {
        return { success: false, message: "Failed to update Complaint" };
    }
};

module.exports.getComplaintById = async (complaintId) => {
    try {
        if (!complaintId)
            return {success: false, message: "Complaint Id Should Be Passed"};
        const complaint = await getComplaintById(complaintId);

        if (!complaint)
            return {success: false, message: "No Complaint with that Id"};
        return { success: true, message: complaint };
    } catch (error) {
        return { success: false, message: "Failed to get Complaint" };
    }
};


module.exports.getAllComplaints = async () => {
    try {
        const complaints = await getAllComplaints();
        return { success: true, message: complaints };
    } catch (error) {
        return { success: false, message: "Failed To Get Complaint" };
    }
};

// validate on the complaintId
const validateId = async (complaintId) => {
    if (!complaintId) {
        return { valid: false, message: "Complaint ID is required" };
    }

    const complaint = await getComplaintById(complaintId);
    if (!complaint) {
        return { valid: false, message: "Complaint not found" };
    }
    return { valid: true, complaint };
};

module.exports.deleteComplaint = async (complaintId) => {
    try {
        const validation = await validateId(complaintId);
        if (!validation.valid) {
            return {success: false, message: validation.message};
        }

        await deleteComplaint(complaintId);
        return { success: true, message: "Complaint deleted successfully" };
    } catch (error) {
        return { success: false, message: "Failed To Delete Complaint" };
    }
};

module.exports.changeComplaintStatus = async (complaintId, status) => {
    try {
        const validation = await validateId(complaintId);
        if (!validation.valid) {
            return {success: false, message: validation.message};
        }

        const updatedComplaint = await changeComplaintStatus(complaintId, status);
        return { success: true, message: updatedComplaint };
    } catch (error) {
        return { success: false, message: "Failed To Save Updates" };
    }
};

module.exports.getComplaintsByUser = async (userId) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }
        const complaints = await getComplaintsByUser(userId);
        return { success: true, message: complaints };
    } catch (error) {
        return { success: false, message: "Failed To Get Data" };
    }
};



module.exports.getComplaintsForCustomersAndGuest = async () => {
    try {
        const onlineComplaints = await getComplaintsForCustomersAndGuest();
        return { success: true, message: onlineComplaints };
    } catch (error) {
        return { success: false, message: "Failed To Get Data" };
    }
}