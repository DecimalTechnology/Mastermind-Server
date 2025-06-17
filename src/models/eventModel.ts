import mongoose from "mongoose";
import { IEvent } from "../interfaces/models/IEvent";

export enum EventLevel {
    CHAPTER = "chapter",
    REGIONAL = "regional",
    NATIONAL = "national",
    GLOBAL = "global",
}

export enum EventStatus{
    UPCOMING= 'upcoming',
    ONGOING ='ongoing',
    CANCELLED ='cancelled',
    ENDED = 'ended'

}

const eventSchema = new mongoose.Schema<IEvent>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    place: { type: String, required: true },
    duration:{type:String},
    image: { type: String },
    location: { type: String },
    audienceType: { type: String, enum: ["all", "selected"], required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    eventType: { type: String, enum: Object.values(EventLevel), required: true },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
    regionId: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
    nationId: { type: mongoose.Schema.Types.ObjectId, ref: "Nation" },
    localId:{type:mongoose.Schema.Types.ObjectId,ref:"Local"},
    status:{type:String,enum:Object.values(EventStatus),default:'upcoming'}
});

const Event  = mongoose.model<IEvent>("Event",eventSchema);
export default Event;