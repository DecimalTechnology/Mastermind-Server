import { NextFunction, Request, Response } from "express";
import { ChapterService } from "./chapterService";
import { chapterSchema } from "../../../../../validations/admin/chapter";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";
import mongoose from "mongoose";
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
        const chapterId = req.params.id;

        const result = await this.chapterService.getChapterById(chapterId as string);
       
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Get all members inside a chapter
    // @route  GET v1/admin/members/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getAllMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const chapterId = req.params.id;
        if (!chapterId || !mongoose.Types.ObjectId.isValid(chapterId)) throw new NotFoundError("Chapter Id required");
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
    // @desc   Find members
    // @route  GET v1/admin/members
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async findMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const adminId = req.adminId;

        const result = await this.chapterService.findMembers(adminId as string, req?.query);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Get admin profile
    // @route  GET v1/admin/chapter/profile
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        const adminId = req.adminId;

        const result = await this.chapterService.getProfile(adminId as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Get all chapter members
    // @route  GET v1/admin/chapter/members/:chapterId;
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getAllChapterMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { chapterId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(chapterId)) throw new BadRequestError("Invalid chapter Id ");
        const result = await this.chapterService.getAllChapterMembers(chapterId);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Create meeting
    // @route  POST v1/admin/chapter/meeting
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async createMeeting(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { members, place, datetime } = req.body;
        if (members.length == 0) throw new BadRequestError("Atleast one member is required");
        if (!place) throw new BadRequestError("Place is required");
        if (!datetime) throw new BadRequestError("Date and time is required");
        const result = await this.chapterService.createMeeting({ members, place, date: datetime, userId: req.adminId });
        res.status(OK).json({ success: true, message: "New meeting successfully created", data: result });
    }
    // @desc   Get all  meeting
    // @route  GET v1/admin/chapter/meeting
    // @access Super_admin, National_admin, Regional_admin, Local_admin

    async getAllMeeting(req: Request, res: Response, next: NextFunction): Promise<void> {
        const adminId = req.adminId;
        const result = await this.chapterService.getAllMeeting(adminId, req.query);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Get all  meeting
    // @route  GET v1/admin/chapter/meeting
    // @access Super_admin, National_admin, Regional_admin, Local_admin

    async getAllMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { chapterId } = req.params;
        if (!chapterId || !mongoose.Types.ObjectId.isValid(chapterId)) {
            throw new BadRequestError("Invalid chapterId");
        }

        const result = await this.chapterService.getAllMedia(chapterId);
        res.status(OK).json({ success: true, message: "", data: result });
    }
}
