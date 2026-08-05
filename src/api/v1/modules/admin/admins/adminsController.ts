import { Request, Response, NextFunction } from "express";
import { AdminsService } from "./adminsService";

export class AdminsController {
    constructor(private adminsService: AdminsService) {}

    async searchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query.search as string;
            const users = await this.adminsService.searchUsers(query);
            res.status(200).json({
                status: "success",
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    async assignRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, role, entityId } = req.body;
            const updatedUser = await this.adminsService.assignRole(userId, role, entityId);
            res.status(200).json({
                status: "success",
                message: "Role assigned successfully",
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }

    async getRegions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const regions = await this.adminsService.getRegions();
            res.status(200).json({
                status: "success",
                data: regions
            });
        } catch (error) {
            next(error);
        }
    }

    async getLocals(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const locals = await this.adminsService.getLocals();
            res.status(200).json({
                status: "success",
                data: locals
            });
        } catch (error) {
            next(error);
        }
    }

    async getChapters(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const chapters = await this.adminsService.getChapters();
            res.status(200).json({
                status: "success",
                data: chapters
            });
        } catch (error) {
            next(error);
        }
    }
}
