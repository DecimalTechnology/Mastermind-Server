"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chapter = void 0;
const mongoose_1 = require("mongoose");
const chapterSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: { type: String },
    nationId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Nation", // Related Nation document
        required: true,
    },
    regionId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Region", // Related Region document
        required: true,
    },
    localId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Local", // Optional further subdivision
        required: true,
    },
    members: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User", // Users who are part of this chapter
        },
    ],
    coreTeam: [{ type: mongoose_1.Types.ObjectId, ref: "User" }],
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User", // Admin or creator reference
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.Chapter = (0, mongoose_1.model)("Chapter", chapterSchema);
