import { Schema, model, Types } from "mongoose";
import { IChapter } from "../interfaces/models/IChaper";

const chapterSchema = new Schema<IChapter>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: { type: String },
        nationId: {
            type: Types.ObjectId,
            ref: "Nation", // Related Nation document
            required: true,
        },
        regionId: {
            type: Types.ObjectId,
            ref: "Region", // Related Region document
            required: true,
        },
        localId: {
            type: Types.ObjectId,
            ref: "Local", // Optional further subdivision
            required: true,
        },
        members: [
            {
                type: Types.ObjectId,
                ref: "User", // Users who are part of this chapter
            },
        ],
        coreTeam: [{ type: Types.ObjectId, ref: "User" }],
        createdBy: {
            type: Types.ObjectId,
            ref: "User", // Admin or creator reference
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Chapter = model<IChapter>("Chapter", chapterSchema);
