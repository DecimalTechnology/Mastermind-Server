import { EventServices } from "./eventServices";
import { NextFunction, query, Request, Response } from "express";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";
import eventSchema from "../../../../../validations/admin/event";
import { reportValidator } from "../../../../../validations/admin/report";
import mongoose from "mongoose";
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
        const images =  (req.files as any).image
        const image = images[0].location;
        if(!image) throw new BadRequestError("Image is required")
        const data = { ...req.body, attendees: JSON.parse(req.body.attendees), customFields: JSON.parse(req.body.customFields) };

      
        const result = await this.eventServices.createEvent(data, req.files, req.adminId as string,image);
        res.status(OK).json({ success: true, message: "New event created successfully", data: result });
    }
    // @desc   Get all the events
    // @route  GET v1/admin/event
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getAllEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
        const chapterId = req.params.id;

        if (!chapterId) throw new NotFoundError("Chapter Id is required");
        const result = await this.eventServices.getAllEvents(chapterId, req.query);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Update events
    // @route  PUT v1/admin/event/id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async updateEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        const eventId = req.params.id;
        const data = { ...req.body, customFields: JSON.parse(req.body.customFields) };
        if (!eventId) throw new NotFoundError("The event Id not found");
        const result = await this.eventServices.updateEvent(eventId, data, req.files);
        res.status(OK).json({ success: true, message: "Event updated successfully", data: result });
    }
    // @desc   Get all rsvp list
    // @route  GET v1/admin/event/rspv-list/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getAllAttendeesList(req: Request, res: Response, next: NextFunction): Promise<void> {
        const eventId = req.params.id;

        const result = await this.eventServices.getAllAttendeesList(eventId);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Find all rsvp users list
    // @route  GET v1/admin/event/rspv-list/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async findAllRsvpUsersList(req: Request, res: Response, next: NextFunction): Promise<void> {
        const eventId = req.params.id;

        const result = await this.eventServices.getAllRsvpList(eventId);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Update attendees list
    // @route  PUT v1/admin/event/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async eventParialUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const eventId = req.params.id;

        const result = await this.eventServices.eventPartialUpdate(eventId, req.body);
        res.status(OK).json({ success: true, message: "Successfully updated", data: result });
    }
    // @desc   Cancel an event
    // @route  PUT v1/admin/event/cancel/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async cancelEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        const eventId = req.params.id;

        const result = await this.eventServices.cancelEvent(eventId, req.body);
        res.status(OK).json({ success: true, message: "Successfully updated", data: result });
    }
    // @desc   Get an event by event id
    // @route  PUT v1/admin/event/:id
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async getEventById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const eventId = req.params.id;

        const result = await this.eventServices.getEventById(eventId);
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Create chapter event report
    // @route  PUT v1/admin/event/chapter/report
    // @access Super_admin, National_admin, Regional_admin, Local_admin
    async createChapterEventReport(req: Request, res: Response, next: NextFunction): Promise<void> {
        reportValidator.parse(req.body);
        if (!req.file || !(req.file as any).location) {
            throw new NotFoundError("Invalid pdf file");
        }
        const file = (req.file as any).location;

        if (!req.file) throw new NotFoundError("Please upload document in pdf format");
        const result = await this.eventServices.createChapterEventReport(req.body, file);
        res.status(OK).json({ success: true, message: "Event report successfully submitted", data: result });
    }

    // @desc Upload images
    // @route POST v1/admin/event/upload-images
    async uploadImageMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
        const adminId = req.adminId;

        const eventId = req.body.eventId;

        if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
            throw new BadRequestError("Invalid Event Id");
        }
        const images = (req.files as any)?.images.map((obj: any) => obj?.location);

        const result = await this.eventServices.uploadMediaImages(adminId, eventId, images);
        res.status(OK).json({ success: true, message: "Images successfully uploaded", data: result });
    }
    // @desc Upload videos
    // @route POST v1/admin/event/upload-videos
    async uploadVideos(req: Request, res: Response, next: NextFunction): Promise<void> {
        const adminId = req.adminId;

        const eventId = req.body.eventId;

        if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
            throw new BadRequestError("Invalid Event Id");
        }
        const videos = (req.files as any)?.videos.map((obj: any) => obj?.location);

        const result = await this.eventServices.uploadVideos(adminId, eventId, videos);
        res.status(OK).json({ success: true, message: "Videos successfully uploaded", data: result });
    }

    async getAllMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
        const eventId = req.params.eventId;
        if (!mongoose.Types.ObjectId.isValid(eventId)) throw new BadRequestError("Invalid event Id");
        const result = await this.eventServices.getAllMedia(eventId);
        res.status(OK).json({ success: true, message: "", data: result });
    }
}
