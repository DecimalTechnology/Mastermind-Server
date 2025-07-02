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

    async getAllEvents(chapterId:string): Promise<IEvent[]> {
        return await Event.find({chapterId:chapterId});
    }

    async getAllAttendeesList(eventId: string): Promise<any> {
        const res = await Event.findOne({ _id: eventId }).populate("attendees");

        return res;
    }

    async findRsvpList(eventId: string): Promise<any> {
        return await Event.findOne({ _id: eventId }).populate("rsvp");
    }
}
