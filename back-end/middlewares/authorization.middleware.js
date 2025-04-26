const {decodedToken} = require("../utils/jwttoken.manager");


const authorize = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const claims = decodedToken(token);

    requireRole = requiredRole.toLowerCase();
    claims.role = claims.role.toLowerCase();

    const rolesRank = {
      "guest": 0,
      "customer": 1,
      "cashier": 3,
      "clerk": 2,
      "seller": 4,
      "manager": 5,
    };

    if (rolesRank[claims.role] < rolesRank[requiredRole]) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
  module.exports = {
    authorize,
  };
  
  