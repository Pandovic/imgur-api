const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next){
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg:"no token, authorizaation denied"})
    }
    try {
        const decoder = jwt.verify(token, config.get('jwtSecret'));
        req.user =decoder.user;
        next();
    } catch (error) {
        
    }
}