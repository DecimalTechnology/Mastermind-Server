import { Request, Response, NextFunction } from "express";
import { UnAuthorizedError } from "../constants/customErrors";

// Extend Request interface to include `user`

const roleAuth = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = req?.role;
        try {
            if (!role || !allowedRoles.includes(role)) {
                throw new UnAuthorizedError("Unauthorized: Role not permitted");
            }
            next();
        } catch (error) {
           
            throw error;
        }
    };
};

export default roleAuth;
