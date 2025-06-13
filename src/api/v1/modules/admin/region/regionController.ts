import { NextFunction, Request, Response } from "express";
import { RegionServices } from "./regionServices";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import { NotFoundError } from "../../../../../constants/customErrors";
const { OK } = STATUS_CODES;

export class RegionController {
    constructor(private regionService: RegionServices) {}

    // @desc   Search users for assignment
    // @route  GET v1/admin/region/users
    // @access Super_admin, National_admin
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = await this.regionService.searchUsers(req.query.search as string);
        res.status(OK).json({
            success: true,
            message: "",
            data: result,
        });
    }
    // @desc   Create region
    // @route  POST v1/admin/region
    // @access Region admin
    async createRegion(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { adminId } = req.query;
        if(!adminId) throw new NotFoundError("Invalid admin data")
        const createdBy = req.adminId;
        const result = await this.regionService.createRegion(req.body, adminId as string, createdBy);

        res.status(OK).json({
            success: true,
            message: "",
            data: result,
        });
    }
    // @desc   Create region
    // @route  GET v1/admin/region
    // @access Region admin
    async findAllRegions(req: Request, res: Response, next: NextFunction): Promise<void> {
        
        const result = await this.regionService.getAllRegions(req.query.search as string)

        res.status(OK).json({
            success: true,
            message: "",
            data: result,
        });
    }
    // @desc   Find region by _id
    // @route  GET v1/admin/region?:id
    // @access Super_admin, National_admin, Regional_admin
    async findRegionById(req: Request, res: Response, next: NextFunction): Promise<void> {
        
        if(!req.params.id) throw new NotFoundError("Region id not found")
        const result = await this.regionService.findRegionById(req.params.id as string)

        res.status(OK).json({
            success: true,
            message: "",
            data: result,
        });
    }
}
