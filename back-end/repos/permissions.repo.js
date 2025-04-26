const mongoose = require('mongoose');

const Permission = require("./../models/permission.model");

// Create a new permission
async function createPermission(data) {
    try {
        const createdPermission =  await Permission.create(data);
        return createdPermission;
    } catch (error) {
        throw new Error(`Error creating permission: ${error.message}`);
    }
}

// Get all permissions
async function getPermissions() {
    try {
        return await Permission.find();
    } catch (error) {
        throw new Error(`Error getting permissions: ${error.message}`);
    }
}

// Get a permission by ID
async function getPermissionById(id) {
    try {
        return await Permission.findById(id);
    } catch (error) {
        throw new Error(`Error getting permission by ID: ${error.message}`);
    }
}

// Update a permission by ID
async function updatePermission(id, data) {
    try {
        const updatedPermission = await Permission.findByIdAndUpdate(id, { $set: data }, { new: true });
        if (!updatedPermission) {
            throw new Error('Permission not found');
        }
        return updatedPermission;
    } catch (error) {
        throw new Error(`Error updating permission: ${error.message}`);
    }
}

// Delete a permission by ID
async function deletePermission(id) {
    try {
        const deletedPermission = await Permission.findByIdAndDelete(id);
        if (!deletedPermission) {
            throw new Error('Permission not found');
        }
        return deletedPermission;
    } catch (error) {
        throw new Error(`Error deleting permission: ${error.message}`);
    }
}

// Get a permission by resource name
async function getPermissionsByResourceName(resourceName) {
    try {
        return await Permission.find({ resource: resourceName });
    } catch (error) {
        throw new Error(`Error getting permission by resource name: ${error.message}`);
    }
}

// Get a permission by resource name and action
async function getPermissionByResourceAndAction(resourceName, action) {
    try {
        return await Permission.findOne({ resource: resourceName, action: action });
    } catch (error) {
        throw new Error(`Error getting permission by resource name and action: ${error.message}`);
    }
}

module.exports = {
    createPermission,
    getPermissions,
    getPermissionById,
    updatePermission,
    deletePermission,
    getPermissionsByResourceName,
    getPermissionByResourceAndAction
};

