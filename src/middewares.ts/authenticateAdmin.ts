import { Request, Response, NextFunction } from "express";
import { UnAuthorizedError } from "../constants/customErrors";
import { verifyRefreshToken, verifyToken } from "../utils/v1/token/token";

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const { mastermind_admin_access_token, mastermind_admin_refresh_token } = req.cookies;

    if (!mastermind_admin_refresh_token) throw new UnAuthorizedError("Session expired. Please login again");

    if (!verifyRefreshToken(mastermind_admin_refresh_token)) throw new UnAuthorizedError("Session expired. Please login again");

    if (!mastermind_admin_access_token) throw new UnAuthorizedError("Access token missing");

    if (!verifyToken(mastermind_admin_access_token)) throw new UnAuthorizedError("Access token expired");

    const { userId, role } = verifyToken(mastermind_admin_access_token).data;

    req.adminId = userId;

    req.role = role;

    next();
};
