import mongoose from "mongoose";

// Sub-schema for goals
const goalSchema = new mongoose.Schema({
    goal: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    target: {
        type: Number,
        required: true,
        min: [0, "Target must be a positive number"]
    },
    achieved: {
        type: Number,
        required: true,
        min: [0, "Achieved must be a positive number"]
    }
}, { _id: true });

// Main schema for Vision Board
const visionBoardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    year: {
        type: Number,
        required: true,
        trim: true,
        index: true
    },
    goalLimit: {
        type: Number,
        default: 8,
        min: [1, "Goal limit must be at least 1"]
    },
    goals: {
        type: [goalSchema],
       
    }
}, { timestamps: true });

// Compound unique index for userId + year
visionBoardSchema.index({ userId: 1, year: 1 }, { unique: true });

export default mongoose.model("VisionBoard", visionBoardSchema);
