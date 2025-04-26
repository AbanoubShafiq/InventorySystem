
// const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs');

const { registerUser, getUserById, getUserByEmail } = require("./user.service");
const { signToken } = require("./../utils/jwttoken.manager");
const Userr = require("../models/user.model");

const createClaims = (user) => {
    const branch = user.branch || {};
    return {
        sub: user._id,
        email: user.email,
        role: user.role,
        branchId: branch._id || null,
        branchName: branch.name || null,
    };
};

const register = async (userData) => {
    try {
        const result = await registerUser(userData);
        if (!result.success)
            return { success: false, message: result.message };

        const claims = createClaims(result.message);
        const token = signToken({ claims });
        return { success: true, message: token };
    } catch (error) {
        return { success: false, message: "Error registering user: " + error.message };
    }
};

const getUserCalims = async (userId) => {
    try {
        const chk = await getUserById(userId);

        if (!chk.success)
            return { success: false, message: chk.message };

        const claims = createClaims(chk.message);
        return { success: true, message: claims.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const login = async (email, password) => {
    try {
        const user = await getUserByEmail(email);
        if (!user.success) {
            return { success: false, message: "Email Or Password Not Valid" };
        }

        const isPasswordValid = await bcrypt.compare(password, user.message.password);
        if (!isPasswordValid) {
            return { success: false, message: "Email Or Password Not Valid" };
        }

        if (!user.message.isActive) {
            return { success: false, message: "Please contact the admin for assistance." };
        }

        const claims = createClaims(user.message);

        const token = signToken({ claims });

        return { success: true, message: token };
    } catch (error) {
        return { success: false, message: "Error logging in: " + error.message };
    }
};

module.exports = {
    register,
    getUserCalims,
    login
};