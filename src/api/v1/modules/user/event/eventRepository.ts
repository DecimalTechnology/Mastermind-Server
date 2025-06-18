import mongoose from "mongoose";
import { IEvent } from "../../../../../interfaces/models/IEvent";
import Event from "../../../../../models/eventModel";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class EventRepository extends BaseRepository<IEvent> {
    constructor() {
        super(Event);
    }

    async findEventsByFilter(sort: string, filter: string, chapterInfo: any,userId:string): Promise<IEvent[]> {

        const chapterId = new mongoose.Types.ObjectId(chapterInfo?._id);
        const localId = new mongoose.Types.ObjectId(chapterInfo?.localId);
        const regionId = new mongoose.Types.ObjectId(chapterInfo?.regionId);
        const nationId = new mongoose.Types.ObjectId(chapterInfo?.nationId);

        // Sort logic with chapter, region, local, nation
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
            pipeline.push({ $match: { localId: nationId } });
        }
        
        pipeline.push({$match:{$or:[{audienceType:'all'},{attendees:{$in:[new mongoose.Types.ObjectId(userId)]}}]}})
        // filter with all, upcoming ,rsvp

        if(filter=='rsvp'){pipeline.push({$match:{rsvp:{$in:[new mongoose.Types.ObjectId(userId)]}}})}
        if(filter=='upcoming'){pipeline.push({$match:{status:'upcoming'}})}
        return await Event.aggregate(pipeline);
    }
}
