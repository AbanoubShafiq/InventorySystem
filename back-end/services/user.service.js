
const { updateSearchIndex } = require("../models/user.model");
const {
    getUsers,
    getUserById:getUserByIdFromRepo,
    getUserByEmail,
    createUser,
    updateUser,
    deactivateUser,
    activateUser,
    deleteUser,
    changeUserRole,
    getUsersByRole,
    changePassword
} = require("./../repos/user.repo")

const {signTokenForResetPassword,verifyToken} = require("./../utils/jwttoken.manager")



const {main} = require("./forgetPassword.service")

// const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs');


// get all users
module.exports.getAllUsers =async () => 
{
    try{
        const users = await getUsers();
        return {success: true, message: users};
    }catch (error)
    {
        return {success: false, message: error.message};
    }
}

// get User By Id
module.exports.getUserById = async (userId) => {
    try {

        if (!userId)
            return { success: false, message: "User Id Should Be passed" };

        const user = await getUserByIdFromRepo(userId);

        if (!user)
            return {success: false, message: "No user With that Id"}

        // console.log(validation)
        return { success: true, message: user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}


// get User By Email
module.exports.getUserByEmail = async (email) => {
    try {
        if (!email) {
            return { success: false, message: "Email Should Be Passed" };
        }
        const user = await getUserByEmail(email);
        if (!user) {
            return { success: false, message: "No User With that Email" };
        }
        return { success: true, message: user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}


// register user 
module.exports.registerUser = async (userData) => {
    try {
        const validation = await validateUserData(userData, true);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        const userSalt = await bcrypt.genSalt(10);

        userData.salt = userSalt;

        userData.password = await bcrypt.hash(userData.password, userData.salt);

        if (userData.role)
            userData.role = (userData.role).toLowerCase();

        const user = await createUser(userData);
        return { success: true, message: user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}


// update user
module.exports.updateUser = async (userId, userData) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        const userValidation = await validateUserData(userData, false);
        if (!userValidation.valid) {
            return { success: false, message: userValidation.message };
        }

        if (userData.password) {
            const userSalt = await bcrypt.genSalt(10);
            userData.salt = userSalt;
            userData.password = await bcrypt.hash(userData.password, userSalt);
        }

        if (userData.role)
            userData.role = (userData.role).toLowerCase();

        const updatedUser = await updateUser(userId, userData);
        return { success: true, message: updatedUser };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// validation on creation or update
const validateUserData = async (data, isNewUser) => {
    const { firstName, lastName, email, password, contactNo,address } = data;

    if (!firstName || !lastName || !email) {
        return { valid: false, message: "All fields must be provided" };
    }
    if (isNewUser) {
        if (!password)
            return { valid: false, message: "All fields must be provided" };
    }


    if (email && isNewUser) {
        // validate email
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: "Invalid email format" };
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return { valid: false, message: "Email already exists" };
        }
    }

    if (password || isNewUser) {
        // validate password complexity
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(password)) {
            return { valid: false, message: "Password must be complex" };
        }
    }

    if (address)
    {
        if (address.zipCode)
        {
            const zipCodeRegex = /^[0-9]{5}$/;
            if (!zipCodeRegex.test(data.address.zipCode)) {
                return { valid: false, message: "Invalid zip code format" };
            }
        }
    }


    if (contactNo)
    {
        const contactNoRegex = /^[0-9]{10,15}$/;
        if (!contactNoRegex.test(contactNo)) {
            return { valid: false, message: "Invalid contact number format" };
        }
    }



    return { valid: true, message: "Valid" };
}

// deactivate user
module.exports.deactivateUser = async (userId) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }


        const updatedUser = await deactivateUser(userId);
        return { success: true, message: updatedUser };
    } catch (error) {
        return { success: false, message: error.message };
    }
}


// activate user
module.exports.activateUser = async (userId) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        const updatedUser = await activateUser(userId);
        return { success: true, message: updatedUser };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// delete user
module.exports.deleteUser = async (userId) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        await deleteUser(userId);
        return { success: true, message: "User deleted successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}


const validateUserId = async (userId) => {
    if (!userId) {
        return { valid: false, message: "User Id Should Be Passed" };
    }

    const user = await getUserByIdFromRepo(userId);
    if (!user) {
        return { valid: false, message: "No User With that Id" };
    }

    return { valid: true, message: user };
}


// validate userId
module.exports.validateUserId = async (userId) => {
    if (!userId) {
        return { valid: false, message: "User Id Should Be Passed" };
    }

    const user = await getUserByIdFromRepo(userId);
    if (!user) {
        return { valid: false, message: "No User With that Id" };
    }

    return { valid: true, message: user };
}

// change user role
module.exports.changeUserRole = async (userId, newRole) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        if (!newRole) {
            return { success: false, message: "New Role Should Be Passed" };
        }
        newRole =newRole.toLowerCase();

        const updatedUser = await changeUserRole(userId, newRole);
        return { success: true, message: updatedUser };
    } catch (error) {
        return { success: false, message: error.message };
    }
}



module.exports.getUsersByRole = async (userRole) => {
    try
    {
        if (!userRole)
            return { success: false, message: "Role Should Be passed" };

        userRole = userRole.toLowerCase();

        const users = await getUsersByRole(userRole);
        
        return {success:true, message: users};

    }catch (error)
    {
        return { success: false, message: error.message }
    }
}


module.exports.userIsActive = async (userId) => {
    const user = await getUserByIdFromRepo(userId);
    return user.isActive;
}


module.exports.requestPasswordReset = async (email) => {
    try
    {
        if (!email)
            return { success: false, message: "Email Should Be passed" };

        const user = await getUserByEmail(email);
        if (!user) {
            return { success: false, message: "No User With that Email" };
        }
        
        const claims = {
            sub: user._id,
            email: user.email,
        }
      
        const chk = await main(user.email, user.firstName, "http://localhost:4200/user/resetPassword");
        if (!chk.success)
            return {success:false, message: chk.message};
        
        const token = await signTokenForResetPassword({claims});

        return {success:true, message: token};
        

    }catch (error)
    {
        return { success: false, message: error.message }
    }
}


module.exports.changePassword = async (email, token, newPassword) => {
    try {
        if (!email || !newPassword) {
            return { success: false, message: "Email and new password must be provided" };
        }

        const decodedToken = await verifyToken(token);
        if (!decodedToken) {
            return { success: false, message: "Invalid or expired token" };
        }

        // Check if the email in the token matches the provided email
        if (decodedToken.email !== email) {
            return { success: false, message: "Email does not match the token" };
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return { success: false, message: "Password must be complex" };
        }


        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const result = await changePassword(email, hashedPassword, salt);

        if (result.modifiedCount > 0) {
            return { success: true, message: "Password changed successfully" };
        } else {
            return { success: false, message: "Failed to change password" };
        }

    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false, message: 'Failed to change password' };
    }
};
