import { NextFunction, Request, Response } from "express";
import { TipsService } from "./tipsService";
import { STATUS_CODES } from "../../../../../constants/statusCodes";

export class TipsContoller {
    constructor(private tipsService: TipsService) {}

    getTip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.tipsService.getTodayTip();
            res.status(STATUS_CODES.OK).json({ success: true, message: "", data: result });
        } catch (error) {
            next(error);
        }
    };
}
