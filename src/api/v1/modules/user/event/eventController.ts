import { EventService } from "./eventService";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
const { OK } = STATUS_CODES;
import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../../../../constants/customErrors";

export class EventController {
    constructor(private eventService: EventService) {}

    // @desc   Get all events
    // @route  GET v1/events
    // @access User
    async getAllEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.userId;
        const { sort, filter, date="" } = req.query;

        if (!sort || !filter) throw new NotFoundError("Please provide filter and sort as query params");

        const response = await this.eventService.getAllEvents(sort as string, filter as string, userId as string, date as string);
         console.log(response)
        res.status(OK).json({ success: true, data: response });
    }
    // @desc   Get event by id
    // @route  GET v1/events/:id
    // @access User
    async getEventById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const eventId = req.params.id;

        if (!eventId) throw new NotFoundError("Please provide eventId");

        const response = await this.eventService.getEventById(eventId as string, req.userId);
        res.status(OK).json({ success: true, data: response });
    }
    // @desc   Get event by id
    // @route  GET v1/events/:id
    // @access User
    async getEventByDate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const date = req.query.date;
        const response = await this.eventService.getEventByDate(date);
        res.status(OK).json({ success: true, data: response });
    }
    // @desc   Register Event
    // @route  PATCH v1/events/register/:id
    // @access User
    async registerEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        const eventId = req.params.id;
        const userId = req.userId;
        if (!eventId) throw new NotFoundError("Please provide event Id");

        const response = await this.eventService.registerEvent(eventId, userId);

        res.status(OK).json({ success: true, data: response, message: "Successfully registered for the event" });
    }
    // @desc   Cancel event registration
    // @route  DELETE v1/events/register/:id
    // @access User
    async cancelRegistration(req: Request, res: Response, next: NextFunction): Promise<void> {
        const eventId = req.params.id;
        const userId = req.userId;
        if (!eventId) throw new NotFoundError("Please provide event Id");

        const response = await this.eventService.cancelRegistration(eventId, userId);
        res.status(OK).json({ success: true, data: response, message: "Your event registration cancelled" });
    }

    // @desc Get all media 
    // @route GET v1/events/media
    async getAllMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
       const userId = req.userId;
       const result = await this.eventService.getAllMedia(userId)

       console.log(result)
       res.status(OK).json({success:true,message:"",data:result})
    }
}
