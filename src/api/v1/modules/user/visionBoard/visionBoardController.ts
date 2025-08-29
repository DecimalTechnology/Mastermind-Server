import { NextFunction, Request, Response } from "express";
import { VisionboardService } from "./visionBoardService";
import { GoalSchema } from "../../../../../validations/user/visionBoardValidation";
import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";
import mongoose from "mongoose";

export class VisionboardController {
    constructor(private visionboardService: VisionboardService) {}

    //@desc Create new visionboard
    //@route POST /visionboard
    async createVisionBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.userId;
        GoalSchema.parse(req.body);
        const result = await this.visionboardService.createVisionBoard(userId, req.body);
        res.status(200).json({ success: true, message: "Visionboard successfully created", data: result });
    }

    //@desc  Delete new visionboard
    //@route DELETE /visionboard
    async deleteGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.userId;
        const { year, goalId } = req.query;
        if (!year) throw new NotFoundError("Year is required");
        
        if (!goalId||!mongoose.Types.ObjectId.isValid(goalId as string)) throw new NotFoundError('Invalid goal _id')
            const currentYear=  new Date().getFullYear()
        if (parseInt(year as string) > currentYear) {
            throw new BadRequestError("Invalid Year provided. Year must be current year or lessthan currrent year");
        }
        const result = await this.visionboardService.deleteGoal(userId, parseInt(year as string), goalId as string);
        res.status(200).json({ success: true, message: "Goal successfully removed", data: result });
    }
    //@desc  Delete new visionboard
    //@route PATCH /visionboard
    async updateGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.userId;
        const { year, goalId } = req.query;
        if (!year) throw new NotFoundError("Year is required");
        // GoalSchema.partial().parse(req.body);
        if (!goalId) throw new NotFoundError("Goal _id is required");
        if (!mongoose.Types.ObjectId.isValid(goalId as string)) throw new BadRequestError("Invalid goal _id");
        const currentYear = new Date().getFullYear();
        if (parseInt(year as string) > currentYear) {
            throw new BadRequestError("Invalid Year provided. Year must be current year or lessthan currrent year");
        }
        const result = await this.visionboardService.updateGoal(userId, parseInt(year as string), goalId as string, req.body);
        res.status(200).json({ success: true, message: "Goal successfully updated", data: result });
    }
    //@desc  Get visionboard
    //@route GEG /visionboard/:year
    async getVisionBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
        
        const userId =  req.userId;
        const {year}  = req.params;
        if(!year||year.length!==4) throw new NotFoundError("Invalid year");
        
        const result = await this.visionboardService.getVisionBoard(userId,parseInt(year as string));
        res.status(200).json({ success: true, message: "", data: result });
    }
}
