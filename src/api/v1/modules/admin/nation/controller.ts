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
        if (!req.body.name || !req.body?.admin) throw new NotFoundError("Nation name is required");
        const result = await this.nationServices.createNation(req.body, req.adminId);
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
}
