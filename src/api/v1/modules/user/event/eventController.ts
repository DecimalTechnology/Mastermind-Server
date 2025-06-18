import { EventService } from "./eventService";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
const { OK } = STATUS_CODES;
import { Request, Response, NextFunction } from "express";

export class EventController {
    constructor(private eventService: EventService) {}

    // @desc   Get all events
    // @route  GET v1/events
    // @access User
    async getAllEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.userId;
        
        const {sort,filter} = req.query;
        const response = await this.eventService.getAllEvents(sort as string ,filter as string,userId as string);
        res.status(OK).json({ success: true, data: response }); 
    }
}
