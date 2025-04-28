
const User = require("./../models/user.model");

// getAllUsers
module.exports.getUsers = async () => {
    try {
        const Users = await User.find({})
        .populate('branch')
        return Users;
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
}

// getUserbyId
module.exports.getUserById = async (userId) => {
    try {
        const user = await User.findById(userId)
        .populate('branch')
        return user;
    } catch (error) {
        throw new Error(`Error fetching user by ID: ${error.message}`);
    }
}

// getUserbyEmail
module.exports.getUserByEmail = async (userEmail) => {
    try {
        const user = await User.findOne({ email: userEmail })
        .populate('branch')
        return user;
    } catch (error) {
        throw new Error(`Error fetching user by email: ${error.message}`);
    }
}





module.exports.updateUser = async (userId, updatedData) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: updatedData },
            { new: true }
        )
        return user;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}

// deactivate user
module.exports.deactivateUser = async (userId) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { isActive: false } },
            { new: true }
        )
        console.log("User Deactivated Successfully!");
        return user;
    } catch (error) {
        throw new Error(`Error deactivating user: ${error.message}`);
    }
}



// createUser
module.exports.createUser = async (data) => {
    try {
        const user = await User.create(data);
        return user;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}


// activateUser
module.exports.activateUser = async (userId) => {
    try {
        const activatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { isActive: true } },
            { new: true }
        );
        console.log("User Activated Successfully!");
        return activatedUser;
    } catch (error) {
        throw new Error(`Error activating user: ${error.message}`);
    }
}

// deleteUser
module.exports.deleteUser = async (userId) => {
    try {
        const user = await User.findOneAndDelete({ _id: userId });
        console.log("User Deleted Successfully!");
        return user;
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
}

// changeUserRole
module.exports.changeUserRole = async (userId, newRole) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { role: newRole } },
            { new: true }
        );
        console.log("User Role Updated Successfully!");
        return updatedUser;
    } catch (error) {
        throw new Error(`Error updating user role: ${error.message}`);
    }
}


// getUsersByRole
module.exports.getUsersByRole = async (selectedRole) => {
    try {
        const users = await User.find({ role: selectedRole })
        .populate('branch')
        return users;
    } catch (error) {
        throw new Error(`Error fetching users by role: ${error.message}`);
    }
}

// change passaword  
module.exports.changePassword = async (userEmail, hashedPassword, newSalt) => {
    try {
        const changes = await User.updateOne({ email: userEmail }, {
            password: hashedPassword,
            salt: newSalt
        });

        return changes;

    } catch (error) {
        throw new Error(`Error While Change the password: ${error.message}`);
    }
}


