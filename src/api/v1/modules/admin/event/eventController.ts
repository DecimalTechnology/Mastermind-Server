import { EventServices } from "./eventServices";
import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import { NotFoundError } from "../../../../../constants/customErrors";
import eventSchema from "../../../../../validations/admin/event";
const { OK } = STATUS_CODES;

export class EventController {
    constructor(private eventServices: EventServices) {}

    // @desc   Find all users
    // @route  GET v1/admin/event/users
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getAllUsersByLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { level, levelId, search } = req.query;
        if (!level || !levelId) throw new NotFoundError("Please provide required fields");
        const result = await this.eventServices.getAllUsersByLevel(level as string, levelId as string, search as string);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   create new event
    // @route  POST v1/admin/event
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        eventSchema.parse(req.body);
        const data = { ...req.body, attendees: JSON.parse(req.body.attendees), customFields: JSON.parse(req.body.customFields) };

         const result = await this.eventServices.createEvent(data,req.files,req.adminId as string);
        res.status(OK).json({ success: true, message: "New event created successfully", data: result});
    }
    // @desc   Get all the events
    // @route  GET v1/admin/event
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getAllEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
        

         const result = await this.eventServices.getAllEvents();
        res.status(OK).json({ success: true, message: "", data: result});
    }
}
