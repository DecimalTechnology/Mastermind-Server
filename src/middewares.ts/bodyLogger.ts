import { NextFunction, Request, Response } from "express";

export const printBody = (req: Request, res: Response, next: NextFunction) => {
    if (Object.values(req.body).length > 0) {
        console.log(req.body);
    }
    next();
};
