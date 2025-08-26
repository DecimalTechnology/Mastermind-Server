import mongoose, { mongo } from "mongoose";
import { EventLevel } from "./eventModel";

export enum EventStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    RESUBMITTED = "resubmitted", // optional, for better clarity
}

const reportSchema = new mongoose.Schema(
    {
        file: { type: String, required: true },

        eventId: { type: mongoose.Types.ObjectId, ref: "Event", required: true },

        reportedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },

        status: {
            type: String,
            enum: Object.values(EventStatus),
            default: EventStatus.PENDING,
        },

        reviewedBy: { type: mongoose.Types.ObjectId, ref: "User" },

        eventType: {
            type: String,
            enum: Object.values(EventLevel),
            default: EventLevel.CHAPTER,
        },
        chapterId: { type: mongoose.Types.ObjectId, ref: "Chapter" },
        localId: { type: mongoose.Types.ObjectId, ref: "Local" },
        regionId: { type: mongoose.Types.ObjectId, ref: "Region" },
        nationId: { type: mongoose.Types.ObjectId, ref: "Nation" },

        remarks: {
            type: String,
            default: "",
        },

        // New: Track resubmission
        resubmissionCount: {
            type: Number,
            default: 0,
        },

        resubmittedAt: {
            type: Date,
        },

        previousFile: {
            type: String, // path or filename of previous PDF
        },
    },
    { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
