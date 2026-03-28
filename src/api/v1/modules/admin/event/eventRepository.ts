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
            return await User.aggregate([{ $match: { chapter: new mongoose.Types.ObjectId(levelId) } }, { $match: { name: { $regex: search, $options: "i" }, role: "member" } }]);
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
        const page = parseInt(query?.page) || 0;

        const matchStage: any = {
            chapterId: new mongoose.Types.ObjectId(chapterId),
        };

        // 🔹 Filter by status
        if (query.status && query.status !== "all") {
            matchStage.status = query.status;
        }

        // 🔹 Filter by date (BETWEEN startDate and endDate)
        if (query.date) {
            const selectedDate = new Date(query.date);

            matchStage.startDate = { $lte: selectedDate };
            matchStage.endDate = { $gte: selectedDate };
        }

        // 🔹 Search filter
        if (query.search) {
            matchStage.$or = [{ name: { $regex: query.search, $options: "i" } }, { description: { $regex: query.search, $options: "i" } }];
        }

        // 🔹 Aggregation
        const events = await Event.aggregate([
            { $match: matchStage },
            { $sort: { startDate: -1 } }, // sort by startDate instead of old date
            { $skip: page * 10 },
            { $limit: 10 },
        ]);

        // 🔹 Total count for pagination
        const totalPage = await Event.countDocuments(matchStage);

        return { events, totalPage };
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
