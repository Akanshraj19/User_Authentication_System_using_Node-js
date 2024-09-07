const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
function verifyToken(req, res, next) {
    var token = "";
    if(req?.cookies?.jwt) token = req.cookies.jwt;

    if (!token){
    return res.status(401).json({ error: 'Access denied' });
    }
    try {
    const decoded = jwt.verify(token, process.env.JWTtoken_pass);
    req.userId = decoded.userId;
    next();
    }  catch (error) {
        console.log(error)
    res.status(401).json({ error: 'Invalid token' });
    }
 };
 
module.exports = verifyToken;