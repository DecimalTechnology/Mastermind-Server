import { NextFunction, Request, Response } from "express";
import { AccountabilitySliService } from "./accountabilitySlicService";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";
const { OK } = STATUS_CODES;
export class AccountabilityController {
    constructor(private accountabilityService: AccountabilitySliService) {}

    // @dec Create accountablity slip
    // @route POST v1/accountability
    // @access User
    async createSlip(req: Request, res: Response, next: NextFunction): Promise<void> {
        req.body.userId = req.userId;
        if (req.body.members.length == 0) throw new BadRequestError("At least 1 member is required.");
        const result = await this.accountabilityService.createAccountablity(req.body);
        res.status(OK).json({ success: true, message: "The accountablity slip has been successfully saved", data: result });
    }
    // @dec Get all slips
    // @route GET v1/accountability
    // @access User
    async getAllSlips(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = await this.accountabilityService.getAllAccountablity(req.userId as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @dec Get all slip by id
    // @route GET v1/accountability/:id
    // @access User
    async getSlipById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const slipId =  req.params.id;
        if(!slipId) throw new NotFoundError("Accountability slip Id not found")
        const result = await this.accountabilityService.getSlipById(slipId);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @dec   Update accountability slip
    // @route PUT v1/accountability/:id
    // @access User
    async updateAccountabilitySlip(req: Request, res: Response, next: NextFunction): Promise<void> {
        const slipId =  req.params.id;
        if(!slipId) throw new NotFoundError("Accountability slip Id not found")
        const result = await this.accountabilityService.updateAccountablitySlip(slipId,req.body);
        res.status(OK).json({ success: true, message: "Accountablity slip successfully updated", data: result });
    }
    // @dec   Update accountability slip
    // @route PUT v1/accountability/:id
    // @access User
    async deleteAccountabilitySlip(req: Request, res: Response, next: NextFunction): Promise<void> {
        const slipId =  req.params.id;
        if(!slipId) throw new NotFoundError("Accountability slip Id not found")
        const result = await this.accountabilityService.deleteAccountabilitySlip(slipId);
        res.status(OK).json({ success: true, message: "Accountablity slip successfully deleted", data: result });
    }
}
