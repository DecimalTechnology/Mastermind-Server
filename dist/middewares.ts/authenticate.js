"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_1 = require("../utils/v1/token/token");
const customErrors_1 = require("../constants/customErrors");
const authenticate = (req, res, next) => {
    var _a;
    const header = req.headers;
    // Try to get the token from Authorization header
    let token = header["authorization"]
        ? header["authorization"].startsWith("Bearer ")
            ? header["authorization"].split(" ")[1]
            : null
        : null;
    // If the token is not found in Authorization, check access-token header
    if (!token) {
        token = header["access-token"];
    }
    // If no token is found in either header, throw an error
    if (!token)
        throw new customErrors_1.UnAuthorizedError("Access token missing");
    // Verify the token
    const accessTokenValid = (0, token_1.verifyToken)(token);
    if (!accessTokenValid)
        throw new customErrors_1.UnAuthorizedError("Access token expired, login again");
    // Store userId from the decoded token
    req.userId = (_a = accessTokenValid.data) === null || _a === void 0 ? void 0 : _a._id;
    next();
};
exports.authenticate = authenticate;
