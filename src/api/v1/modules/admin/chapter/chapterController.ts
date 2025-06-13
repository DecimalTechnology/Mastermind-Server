import { NextFunction, Request, Response } from "express";
import { ChapterService } from "./chapterService";
import { chapterSchema } from "../../../../../validations/admin/chapter";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
const { OK } = STATUS_CODES;

export class ChapterController {
    constructor(private chapterService: ChapterService) {}

    async createChapter(req: Request, res: Response, next: NextFunction): Promise<void> {
        chapterSchema.parse(req.body);
        const result = await this.chapterService.createChapter(req.body);
        res.status(OK).json({ success: true, message: "New chapter successfully added", json: result });
    }

    async getAllChapters(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = await this.chapterService.getAllChapters();
        res.status(OK).json({ success: true, message: "", data: result });
    }
}
