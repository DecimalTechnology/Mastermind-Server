"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const customErrors_1 = require("../constants/customErrors");
const token_1 = require("../utils/v1/token/token");
const adminAuth = (req, res, next) => {
    const { mastermind_admin_access_token, mastermind_admin_refresh_token } = req.cookies;
    if (!mastermind_admin_refresh_token)
        throw new customErrors_1.UnAuthorizedError("Session expired. Please login again");
    if (!(0, token_1.verifyRefreshToken)(mastermind_admin_refresh_token))
        throw new customErrors_1.UnAuthorizedError("Session expired. Please login again");
    if (!mastermind_admin_access_token)
        throw new customErrors_1.UnAuthorizedError("Access token missing");
    if (!(0, token_1.verifyToken)(mastermind_admin_access_token))
        throw new customErrors_1.UnAuthorizedError("Access token expired");
    const { userId, role } = (0, token_1.verifyToken)(mastermind_admin_access_token).data;
    req.adminId = userId;
    req.role = role;
    next();
};
exports.adminAuth = adminAuth;
