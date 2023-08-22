const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAdmin = asyncHandler(async(req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) {
        res.status(401);
        throw new Error("Cannot Authorize User, No Token")
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) {
            res.status(403);
            throw new Error("User Unauthorized, Token Not Valid")
        }
        if(decoded.userDetails.isAdmin === false) {
            res.status(403);
            throw new Error("User Unauthorized, Not Allowed To Access This Resource");
        }
        req.user = {
            id: decoded.userDetails.id,
            isAdmin: decoded.userDetails.isAdmin,
        };
        req.sent = true;
        next();
    });
});

module.exports = verifyAdmin;