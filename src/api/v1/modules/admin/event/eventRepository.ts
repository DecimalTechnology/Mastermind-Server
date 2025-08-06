import mongoose from "mongoose";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";
import Event from "../../../../../models/eventModel";
import { IEvent } from "../../../../../interfaces/models/IEvent";

export class EventRepository extends BaseRepository<IEvent> {
    constructor() {
        super(Event);
    }
    async findAllUsersByLevel(level: string, levelId: string, search: string): Promise<any> {
        if (level == "chapter") {
            return await User.aggregate([
                { $match: { chapter: new mongoose.Types.ObjectId(levelId) } },
                { $match: { name: { $regex: search, $options: "i" }, role: "member" } },
            ]);
        }

        if (level == "region") {
        }

        if (level == "local") {
        }

        if (level == "nation") {
        }
        if (level == "global") {
        }

        return "";
    }

    async getAllEvents(chapterId: string, query: any): Promise<any> {
        const page = query?.page||0

        const matchStage: any = {
            chapterId: new mongoose.Types.ObjectId(chapterId),
        };

        // Match status if provided
        if (query.status && query?.status !== "all") {
            matchStage.status = query.status;
        }

        // Match date if provided (exact day in local timezone, e.g., IST)
        if (query.date) {
            const date = new Date(query.date);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            matchStage.date = {
                $gte: date,
                $lt: nextDay,
            };
        }

        // Text search if provided
        if (query.search) {
            matchStage.$or = [
                { name: { $regex: query.search, $options: "i" } }, // case-insensitive
                { description: { $regex: query.search, $options: "i" } },
            ];
        }

        const events =  await Event.aggregate([
            { $match: matchStage },
            { $skip: parseInt(query?.page) * 10 },
            { $limit: 10 },
            { $sort: { date: -1 } }, // Optional: sort by latest
        ]);
        const totalPage = await Event.countDocuments();
        

        return {events:events,totalPage:totalPage}
    }

    async getAllAttendeesList(eventId: string): Promise<any> {
        const res = await Event.findOne({ _id: eventId }).populate("attendees");

        return res;
    }

    async findRsvpList(eventId: string): Promise<any> {
        return await Event.findOne({ _id: eventId }).populate("rsvp");
    }
    async findByEventId(eventId: string): Promise<any> {
        return await Event.findById(eventId).populate("rsvp").populate("attendees").populate("createdBy").populate("chapterId");
    }
}
