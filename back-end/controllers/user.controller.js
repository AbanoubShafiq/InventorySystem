
const {getAllUsers,
    getUserById,
    // registerUser,
    updateUser,
    deactivateUser,
    activateUser,
    deleteUser,
    changeUserRole,
    getUserByEmail,
    getUsersByRole,
    requestPasswordReset,
    changePassword
} = require ("./../services/user.service")

const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")



const {main} = require("./../services/forgetPassword.service")

const {register, login} = require("./../services/auth.service")

const router = require("express").Router();
const express = require("express");


router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

// get all users
router.get("/getAllUsers", authenticaiton, authorize("manager"), async (req, res, next) => {
    const users = await getAllUsers();
    if (users.success)
        return res.json(users.message);
    else 
        return res.status(400).json(users.message);
})


router.get("/getUserById/:id", authenticaiton, authorize("customer"), async (req, res, next) => {
    try {
        // console.log(req.params.id)
        const user = await getUserById(req.params.id);
        // console.log(user)
        if (user.success)
            return res.json(user.message);
        else    
            return res.status(400).json(user.message);
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
});

router.get("/getUserByEmail/:email", authenticaiton, authorize("customer"), async (req, res, next) => {
    try {
        const user = await getUserByEmail(req.params.email);
        if (user.success)
            return res.json(user.message);
        else
            return res.status(400).json(user.message);
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
});

// register user 
router.post("/register", async (req, res, next) => {
    try {
        // console.log(req.body)
        const user = await register(req.body);
        // console.log(user)
        if (user.success)
            return res.status(201).json({token: user.message});
        else
            return res.status(400).json({token: user.message});
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});



router.put("/updateUser/:id", authenticaiton, authorize("customer"), async (req, res, next) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        console.log(updatedUser)
        if (updatedUser.success)
            return res.json(updatedUser.message);
        else
            return res.status(400).json(updatedUser.message);
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
});


router.put("/deactivateUser/:id",authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
        const deactivatedUser = await deactivateUser(req.params.id);
        console.log(deactivatedUser)
        if (deactivatedUser.success)
            return res.json(deactivatedUser.message);
        else
            return res.status(400).json(deactivatedUser.message);
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
});


router.put("/activateUser/:id",authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
        const activatedUser = await activateUser(req.params.id);
        if (activatedUser.success)
            return res.json(activatedUser.message);
        else
            return res.status(400).json(activatedUser.message);
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
});

router.delete("/deleteUser/:id",authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
        const deletedUser = await deleteUser(req.params.id);
        if (deletedUser.success)
            return res.json(deletedUser.message);
        else
            return res.status(400).json(deletedUser.message);
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
});


router.put("/changeUserRole/:id",authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
        const updatedUserRole = await changeUserRole(req.params.id, req.body.role);
        if (updatedUserRole.success)
            return res.json(updatedUserRole.message);
        else
            return res.status(400).json(updatedUserRole.message);
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
});


router.post("/login", async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await login(email, password);
        if (user.success)
            return res.status(200).json({token: user.message});
        else
            return res.status(400).json({message: user.message});
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});


router.get("/getUsersBasedOnRole/:role", authenticaiton, authorize("manager"), async (req,res) => {
    try{
        const result = await getUsersByRole(req.params.role);
        console.log(result)
        if (!result.success)
            return res.status(400).json({message: result.message});

        return res.status(200).json(result.message);

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }    
})

router.post("/requestPasswordReset/:email", async (req, res) => {
    try
    {
        const chk = await requestPasswordReset(req.params.email);
        if (!chk.success)
            return res.status(400).json({message: chk.message});

        return res.status(200).json({message: chk.message});

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    } 
})



router.post('/resetPassword', async (req, res) => {
    const { email, token, newPassword } = req.body;
    try {

        const result = await changePassword(email,token, newPassword);
        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            if (result.message == "Invalid or expired token")
                res.status(401).json({ message: result.message });
            else 
                res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports =router;



