import { NextFunction, Request, Response } from "express";
import { TYCBServices } from "./TYCBServices";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
const { OK } = STATUS_CODES;

export class TYCBController {
    constructor(private tycbServices: TYCBServices) {}

    // @desc   Create tycb
    // @route  POST v1/tycb/:id
    // @access User
    async createTycb(req: Request, res: Response, next: NextFunction): Promise<void> {
        const toUser = req.params.id;
        const fromUser = req.userId;
        const newTycb = {
            ...req.body,
            toUser,
            fromUser,
        };

        const result = await this.tycbServices.createTycb(newTycb);
        res.status(OK).json({ success: true, message: "Thank you! Your business appreciation has been recorded successfully.", data: result });
    }
    // @desc   Get all tycb
    // @route  GET v1/tycb
    // @access User
    async getAllTycb(req: Request, res: Response, next: NextFunction): Promise<void> {
      
        const result = await this.tycbServices.getAllTycb(req.userId);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Get all sent tycb
    // @route  GET v1/tycb/sent
    // @access User
    async getAllSentTycb(req: Request, res: Response, next: NextFunction): Promise<void> {
      
        const result = await this.tycbServices.getAllSentTycb(req.userId);
        res.status(OK).json({ success: true, message: "", data: result });
    }
}
