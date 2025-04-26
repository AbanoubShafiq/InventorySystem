const {verifyToken, decodedToken} = require("../utils/jwttoken.manager");

const authenticaiton = async (req, res, next) => 
{
    try {
        // because the token consists of two parts: Bearer and another token 
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        // if the token is not verified => will return an issue => go to catch
        const isValid = verifyToken(token);
        console.log(isValid);
        if (!isValid) {
            throw new Error("Invalid token");
        }
        const claims = decodedToken(token);
        req.user = claims;
        next();

    } catch (error) {
        res.status(401).json({message: "Unauthenticated"});
    }
}


module.exports = {
    authenticaiton
}

