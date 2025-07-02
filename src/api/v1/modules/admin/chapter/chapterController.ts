import { NextFunction, Request, Response } from "express";
import { ChapterService } from "./chapterService";
import { chapterSchema } from "../../../../../validations/admin/chapter";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import { NotFoundError } from "../../../../../constants/customErrors";
const { OK } = STATUS_CODES;

export class ChapterController {
    constructor(private chapterService: ChapterService) {}

    // @desc   Create chapter
    // @route  POST v1/admin/chapter
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async createChapter(req: Request, res: Response, next: NextFunction): Promise<void> {
        chapterSchema.parse(req.body);
        const result = await this.chapterService.createChapter(req.body);
        res.status(OK).json({ success: true, message: "New chapter successfully added", data: result });
    }
    // @desc   Get all chapters
    // @route  GET v1/admin/chaper/all
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getAllChapters(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { search, localId } = req.query;
        console.log(search, localId);

        const result = await this.chapterService.getAllChapters(search as string, localId as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }

    // @desc   Get all users
    // @route  GET v1/admin/users
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = await this.chapterService.getAllUsersBySearch(req.query.search as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Get all by which level like chapter, region, nation, local
    // @route  GET v1/admin/event/users
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getAllUsersByLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { level, levelId, search } = req.query;
        if (!level || !levelId) throw new NotFoundError("Please provide required fields");
        const result = await this.chapterService.getAllUsersByLevel(level as string, levelId as string, search as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }

    // @desc   Get all users
    // @route  GET v1/admin/users
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getChapterById(req: Request, res: Response, next: NextFunction): Promise<void> {
         const chapterId =  req.params.id;
         
         const result = await this.chapterService.getChapterById(chapterId as string);
         res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Get all members inside a chapter
    // @route  GET v1/admin/members/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getAllMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const chapterId = req.params.id;
        if (!chapterId) throw new NotFoundError("Chapter Id required");
        const result = await this.chapterService.getAllMembersByChapterId(chapterId as string, req.query);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Block member
    // @route  GET v1/admin/member/block/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async blockMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        if (!userId) throw new NotFoundError("User Id not found");
        const result = await this.chapterService.blockUser(userId as string);
        res.status(OK).json({ success: true, message: "User is now blocked and cannot access the system.", data: result });
    }
    // @desc   Unblock user
    // @route  GET v1/admin/members/unblock/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async unblockMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        if (!userId) throw new NotFoundError("User Id not found");
        const result = await this.chapterService.unblockUser(userId as string);
        res.status(OK).json({ success: true, message: "User is now active and can access the system", data: result });
    }
}
