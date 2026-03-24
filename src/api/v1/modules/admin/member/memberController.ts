import { NextFunction, Request, response, Response } from "express";
import { MemberService } from "./memberService";
import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";

import { STATUS_CODES } from "../../../../../constants/statusCodes";
import mongoose from "mongoose";
import User from "../../../../../models/userModel";
const { OK } = STATUS_CODES;
export class MemberController {
    constructor(private memberService: MemberService) {}
    // @desc   Block member
    // @route  PATCH v1/admin/member/block/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async blockMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        if (!userId) throw new NotFoundError("User Id not found");
        const result = await this.memberService.blockUser(userId as string);
        res.status(OK).json({ success: true, message: "User is now blocked and cannot access the system.", data: result });
    }
    // @desc   Unblock user
    // @route  PATCH v1/admin/members/unblock/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async unblockMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        if (!userId) throw new NotFoundError("User Id not found");
        const result = await this.memberService.unblockUser(userId as string);
        res.status(OK).json({ success: true, message: "User is now active and can access the system", data: result });
    }
    // @desc   Reject user
    // @route  PATCH v1/admin/members/reject/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async rejectMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        const { reason } = req.body;
        if (!userId) throw new NotFoundError("User Id not found");
        if (!reason) throw new NotFoundError("Please provide reason for rejection");
        const result = await this.memberService.rejectUser(userId as string, reason);
        res.status(OK).json({ success: true, message: "The user registration request has been rejected and their data has been permanently removed from the system.", data: result });
    }
    // @desc   Accept user
    // @route  PATCH v1/admin/members/accept/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async acceptUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;

        if (!userId) throw new NotFoundError("User Id not found");

        const result = await this.memberService.acceptUser(userId as string);
        res.status(OK).json({ success: true, message: "The users request successfully accepted", data: result });
    }

    async getAllMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { type, page = 1, id } = req.query as any;
        if (!["chapter", "region", "local", "nation"].includes(type)) {
            throw new BadRequestError("Invalid Hierarchy type");
        }

        if (!id) throw new BadRequestError("Hierarchy Id is required");

        const result = await this.memberService.getAllMembers(type as string, id as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    async getMemberById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { memberId } = req.params;

        if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) throw new BadRequestError("Member not found");

        const result = await this.memberService.getMemberById(memberId as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    async getMemberAccountabilityHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { memberId } = req.params;

        if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) throw new BadRequestError("Member not found");

        const result = await this.memberService.getMemberAccountablityHistory(memberId as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    async getMemeberMeetingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { memberId } = req.params;

        if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) throw new BadRequestError("Member not found");

        const result = await this.memberService.getMemberMeetingDetails(memberId as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }


    async getMemberEventDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { memberId } = req.params;
       
        if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) throw new BadRequestError("Member not found");

        const result = await this.memberService.getMemberEventDetails(memberId as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }


    async getMemberConnectionDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { memberId } = req.params;
       
        if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) throw new BadRequestError("Member not found");

        const result = await this.memberService.getMemberConnectionDetails(memberId as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }
}
