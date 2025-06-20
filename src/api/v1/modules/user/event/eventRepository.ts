import mongoose from "mongoose";
import { IEvent } from "../../../../../interfaces/models/IEvent";
import Event from "../../../../../models/eventModel";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";
import { BadRequestError, ConflictError, NotFoundError } from "../../../../../constants/customErrors";

export class EventRepository extends BaseRepository<IEvent> {
    constructor() {
        super(Event);
    }

    async findEventsByFilter(sort: string, filter: string, chapterInfo: any, userId: string, date: string): Promise<IEvent[]> {
        const chapterId = new mongoose.Types.ObjectId(chapterInfo?._id);
        const localId = new mongoose.Types.ObjectId(chapterInfo?.localId);
        const regionId = new mongoose.Types.ObjectId(chapterInfo?.regionId);
        const nationId = new mongoose.Types.ObjectId(chapterInfo?.nationId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        let pipeline: any = [];
        pipeline.push({ $match: { eventType: sort } });

        if (sort == "chapter") {
            pipeline.push({ $match: { chapterId: chapterId } });
        }
        if (sort == "region") {
            pipeline.push({ $match: { regionId: regionId } });
        }
        if (sort == "local") {
            pipeline.push({ $match: { localId: localId } });
        }
        if (sort == "nation") {
            pipeline.push({ $match: { nationId: nationId } }); // ✅ Fixed: was using localId mistakenly before
        }

        pipeline.push({
            $match: {
                $or: [{ audienceType: "all" }, { attendees: { $in: [userObjectId] } }],
            },
        });

        if (filter == "rsvp") {
            pipeline.push({ $match: { rsvp: { $in: [userObjectId] } } });
        }
        if (filter == "upcoming") {
            pipeline.push({ $match: { status: "upcoming" } });
        }

        if (date) {
            const inputDate = new Date(date);
            const startOfDay = new Date(inputDate);
            startOfDay.setUTCHours(0, 0, 0, 0);

            const endOfDay = new Date(inputDate);
            endOfDay.setUTCHours(23, 59, 59, 999);

            pipeline.push({
                $match: {
                    date: {
                        $gte: startOfDay,
                        $lte: endOfDay,
                    },
                },
            });
        }

        // ✅ Add 'registered' field: true if userId in rsvp array
        pipeline.push({
            $addFields: {
                registered: { $in: [userObjectId, "$rsvp"] },
            },
        });

        const res = await Event.aggregate(pipeline);
       
        return res;
    }

    async findEventByDate(date: string): Promise<any> {
        const dateObj = new Date(date);
        console.log(date, "----", dateObj);
        return await Event.find({ date: new Date(date) });
    }
    async registerEvent(eventId: string, userId: string): Promise<any> {
        const event = await Event.findById(eventId);
        if (!event) throw new NotFoundError("Event not found");

        if (event.rsvp.includes(userId)) {
            throw new BadRequestError("User already registered for this event");
        }

        return await Event.findByIdAndUpdate(eventId, { $addToSet: { rsvp: userId } }, { new: true });
    }

    async cancelRegistration(eventId: string, userId: string): Promise<any> {
        const event = await Event.findById(eventId);
        if (!event) throw new NotFoundError("Event not found");

        if (!event.rsvp.includes(userId)) {
            throw new BadRequestError("User is not registered for this event");
        }

        return await Event.findByIdAndUpdate(eventId, { $pull: { rsvp: userId } }, { new: true });
    }

async getEventByEventId(eventId: string, userId: string): Promise<IEvent | null> {

    const objectId = new mongoose.Types.ObjectId(eventId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const res = await Event.aggregate([
        { $match: { _id: objectId } },
        {
            $addFields: {
                registered: { $in: [userObjectId, "$rsvp"] }
            }
        }
    ]);
    if(!res[0]) throw new NotFoundError("Event not found")

    return res[0] || null; 
}

}
