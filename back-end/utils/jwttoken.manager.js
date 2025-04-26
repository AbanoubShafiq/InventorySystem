const jwt = require("jsonwebtoken")
// sign 
// payload => claims
module.exports.signToken = ({claims})=> {
    return jwt.sign(claims, process.env.SECRET_KEY, {expiresIn: process.env.JWT_EXPIRY || "1d"})
}


// verify 
module.exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        console.error("Token verification failed:", err);
        return null;
    }
}


// take token => return claims
module.exports.decodedToken = (token)=>{
    return jwt.decode(token);
}


module.exports.signTokenForResetPassword = ({claims})=> {
    return jwt.sign(claims, process.env.SECRET_KEY, {expiresIn: "30m"})
}