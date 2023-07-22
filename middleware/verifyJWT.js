const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyJWT = asyncHandler(async(req, res, next) => {
    const authHeader = req.body.headers.authorization || req.body.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) {
        res.status(401);
        throw new Error("Cannot Authorize User, No Token")
    };
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) {
            res.status(403);
            throw new Error("User Unauthorized, Token Not Valid")
        }
        req.user = {
            id: decoded.userDetails.id,
            username: decoded.userDetails.username,
            accountType: decoded.userDetails.accountType
        };
        next();
    });
});

module.exports = verifyJWT;