const {
    getPermissions,
    createPermission,
    getPermissionById,
    updatePermission,
    deletePermission,
    getPermissionsByResourceName,
    getPermissionByResourceAndAction
} = require("./../repos/permissions.repo");

module.exports.getAllPermissions =async () => {
    try {
        const permissions = await getPermissions();
        return { success: true, message: permissions };
    } catch (error) {
        return { success: false, message: 'Error fetching permissions' };
    }
}


module.exports.getPermissionByIdd = async (id) => {
    try {
        if(!id)
            return { valid: false, message: "Id should be passed!" };
        const permission = await getPermissionById(id);
        if (!permission) {
            return { success: false, message: 'Permission not found' };
        }
        return { success: true, message: permission };
    } catch (error) {
        return { success: false, message: 'Error fetching permission' };
    }
}

// valiate data before create or update 
const validateCreateOrUpdate = async (permissionData, isNewRecord) => {
    try {
        if (isNewRecord)
        {
            if (!permissionData.resource || !permissionData.action || !permissionData.description) {
                return { valid: false, message: 'Resource, action, and description are required' };
            }
        }
        const chk = await getPermissionByResourceAndAction(permissionData.resource, permissionData.action);
        if (chk)
        {
            return { valid: false, message: 'Permission with the same resource and action already exists' };
        }
        return { valid: true, message: 'Permission data is valid for creation' };
    } catch (error) {
        return { valid: false, message: error.message };
    }
}

module.exports.createPermission = async (permissionData) => {
    try {
        const chk = await validateCreateOrUpdate(permissionData, true);
        if (!chk.valid)
        {
            return {success: false, message: chk.message};
        }
        const newPermission = await createPermission(permissionData);
        return { success: true, message: newPermission };
    } catch (error) {
        return { success: false, message: 'Error creating permission' };
    }
}

module.exports.updatePermission = async (id, permissionData) => {
    try {

        const chkId = await validatePermissionId(id);
        if (!chkId.valid) {
            return { success: false, message: chk.message };
        }

        const chk = await validateCreateOrUpdate (permissionData, false);
        if (!chk.valid)
            return { success: false, message: chk.message};
        const updatedPermission = await updatePermission(id, permissionData);
        return { success: true, message: updatedPermission };
    } catch (error) {
        return { success: false, message: 'Error updating permission' };
    }
}


module.exports.deletePermission = async (id) => {
    try {
        const chk = await validatePermissionId(id);
        if (!chk.valid) {
            return { success: false, message: chk.message };
        }

        await deletePermission(id);
        return { success: true, message: 'Permission deleted successfully' };
    } catch (error) {
        return { success: false, message: 'Error deleting permission' };
    }
}

// Validates if the provided permission ID exists in the database.
async function validatePermissionId(id) {
    if (!id) {
        return { valid: false, message: "Id should be passed!" };
    }
    const permission = await getPermissionById(id);
    if (!permission) {
        return { valid: false, message: "No permission with that id!" };
    }
    return { valid: true, message: "Permission id is valid" };
}


module.exports.getPermissionsByResourceName = async(resourceName) => {
    try {
        if (!resourceName) {
            return { success: false, message: "Resource name should be passed!" };
        }
        const permissions = await getPermissionsByResourceName(resourceName);
        if (!permissions || permissions.length === 0) {
            return { success: false, message: 'No permissions found for the given resource name' };
        }
        return { success: true, message: permissions };
    } catch (error) {
        return { success: false, message: 'Error fetching permissions by resource name' };
    }
}





