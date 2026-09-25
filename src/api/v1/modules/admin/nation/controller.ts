import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../../../../constants/customErrors";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
const { OK } = STATUS_CODES;
import { NationServices } from "./services";
export class NationController {
    constructor(private nationServices: NationServices) {}

    // @desc   Create new nation
    // @route  POST v1/admin/nation
    // @access Super admin
    async createNation(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.body.name) throw new NotFoundError("Nation name is required");
        if(!req.query.adminId) throw new NotFoundError("Admin data not found")
        const result = await this.nationServices.createNation(req.body,req.query.adminId as string, req.adminId as string);
        res.status(OK).json({
            success: true,
            message: "New nation created successfully",
            data:result
        });
    } 

    // @desc   Create new nation
    // @route  POST v1/admin/nation
    // @access Super admin
    async findUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = await this.nationServices.searchUsers(req.query.search as string);
        res.status(OK).json({
            success: true,
            message: "New nation created successfully",
            data: result,
        });
    }
    // @desc   Find all nations
    // @route  GET v1/superadmin/nations
    // @access Super admin
    async getAllNations(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = await this.nationServices.searchNations(req.query.search as string);
        res.status(OK).json({
            success: true,
            message: "",
            data: result,
        });
    }

    // @desc   Get community tree hierarchy
    // @route  GET v1/admin/nation/tree
    // @access Super/Global admin
    async getCommunityTree(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = await this.nationServices.getCommunityTree();
        res.status(OK).json({
            success: true,
            message: "Community tree retrieved successfully",
            data: result,
        });
    }

    // @desc   Update nation
    // @route  PUT v1/admin/nation/:id
    // @access Super admin
    async updateNation(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        const { adminId } = req.query;
        if (!id) throw new NotFoundError("Nation ID not found");
        const result = await this.nationServices.updateNation(id, req.body, adminId as string);
        res.status(OK).json({
            success: true,
            message: "Nation updated successfully",
            data: result
        });
    }

    // @desc   Delete nation
    // @route  DELETE v1/admin/nation/:id
    // @access Super admin
    async deleteNation(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) throw new NotFoundError("Nation ID not found");
        await this.nationServices.deleteNation(id);
        res.status(OK).json({
            success: true,
            message: "Nation deleted successfully"
        });
    }

    // @desc   Get nation details
    // @route  GET v1/admin/nation/details/:id
    // @access Super admin
    async getNationDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) throw new NotFoundError("Nation ID not found");
        const result = await this.nationServices.getNationDetails(id);
        res.status(OK).json({
            success: true,
            message: "Nation details retrieved successfully",
            data: result
        });
    }
}

