import { NextFunction, Request, Response } from "express";
import { TipsService } from "./tipsService";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import { BadRequestError } from "../../../../../constants/customErrors";
import mongoose from "mongoose";

export class TipsContoller {
    constructor(private tipsService: TipsService) {}

    // @desc   Get all tips
    // @route  GET v1/tips
    // @access Public
    getTip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.tipsService.getTodayTip();
            res.status(STATUS_CODES.OK).json({ success: true, message: "", data: result });
        } catch (error) {
            next(error);
        }
    };

    // @desc   Get tips by id
    // @route  GET v1/tips/:id
    // @access Public
    getTipsById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { tipsId } = req.params;
            if (!tipsId || !mongoose.Types.ObjectId.isValid(tipsId)) throw new BadRequestError("Invalid tipsId");

            const result = await this.tipsService.getTipsById(tipsId);
            res.status(STATUS_CODES.OK).json({ success: true, message: "", data: result });
        } catch (error) {
            next(error);
        }
    };

    // @like tips by id
    // @route  POST v1/tips/:id/like
    // @access Public
    likeTips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { tipsId } = req.params;
            if (!tipsId || !mongoose.Types.ObjectId.isValid(tipsId)) throw new BadRequestError("Invalid tipsId");
            const result = await this.tipsService.likeTips(req.userId,tipsId);
            res.status(STATUS_CODES.OK).json({ success: true, message: "You have successfully liked this tips", data: result });
        } catch (error) {
            next(error);
        }
    };
    // @Dislike tips by id
    // @route  POST v1/tips/:id/dislike
    // @access Public
    dislikeTips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { tipsId } = req.params;
            if (!tipsId || !mongoose.Types.ObjectId.isValid(tipsId)) throw new BadRequestError("Invalid tipsId");
            const result = await this.tipsService.dislikeTips(req.userId,tipsId)
            res.status(STATUS_CODES.OK).json({ success: true, message: "You have successfully disliked this tips", data: result });
        } catch (error) {
            next(error);
        }
    };
}
