import { LocalServices } from "./localServices";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
const { OK } = STATUS_CODES;
import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../../../../constants/customErrors";

export class LocalController {
    constructor(private localServices: LocalServices) {}

    // @desc   Get All Users
    // @route  GET v1/admin/local/users
    // @access Super_admin, National_admin, Regional_admin
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this.localServices.getAllUsers(req.query.search as string);
            res.status(OK).json({ success: true, data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   Get All regions
    // @route  GET v1/admin/local
    // @access Super_admin, National_admin, Regional_admin
    async getAllLocals(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this.localServices.getAllLocals(req.query.search as string,req.query.regionId as string);
            res.status(OK).json({ success: true, data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   Create local area
    // @route  POST v1/admin/local
    // @access Super_admin, National_admin, Regional_admin
    async createLocalArea(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const createdBy = req.adminId;
            const adminId = req.query.adminId;
            const response = await this.localServices.createLocal(req.body,adminId  as string,createdBy);
            res.status(OK).json({ success: true, data: response ,message:"New local area successfully created"});
        } catch (error) {
            next(error);
        }
    }
    // @desc   Find local data by id 
    // @route  POST v1/admin/local/:id
    // @access Super_admin, National_admin, Regional_admin
    async findLocalById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const chapterId = req.query.id;
            if(!chapterId) throw new NotFoundError("Chapter id not found ")
            const response = await this.localServices.findLocalById(chapterId as string);
            res.status(OK).json({ success: true, data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   Get all reports
    // @route  GET v1/admin/local/reports
    // @access Super_admin, National_admin, Regional_admin
    async getAllReports(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const adminId = req.adminId;
            const response = await this.localServices.findAllReports(adminId as string,req.query);
            res.status(OK).json({ success: true, data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   Get all reports
    // @route  GET v1/admin/local/reports
    // @access Super_admin, National_admin, Regional_admin
    async getAllLocalDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const adminId = req.adminId;
  
            const response = await this.localServices.getLocalDetails(adminId as string);
            res.status(OK).json({ success: true, data: response });
        } catch (error) {
            next(error);
        }
    }

    async getCoreTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { chapterId } = req.params;
            const response = await this.localServices.getCoreTeamByChapter(chapterId);
            res.status(OK).json({ success: true, data: response });
        } catch (error) {
            next(error);
        }
    }

    async searchChapterMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { chapterId } = req.params;
            const search = req.query.search as string;
            const response = await this.localServices.searchChapterMembers(chapterId, search);
            res.status(OK).json({ success: true, data: response });
        } catch (error) {
            next(error);
        }
    }

    async updateCoreTeamRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, isAdd, chapterId } = req.body;
            const response = await this.localServices.updateCoreTeamRole(userId, isAdd, chapterId);
            res.status(OK).json({ success: true, data: response, message: "Core team status successfully updated" });
        } catch (error) {
            next(error);
        }
    }

    async updateLocalArea(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const adminId = req.query.adminId as string;
            const response = await this.localServices.updateLocal(id, req.body, adminId);
            res.status(OK).json({ success: true, data: response, message: "Local area successfully updated" });
        } catch (error) {
            next(error);
        }
    }

    async deleteLocalArea(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            await this.localServices.deleteLocal(id);
            res.status(OK).json({ success: true, message: "Local area successfully deleted" });
        } catch (error) {
            next(error);
        }
    }
}
