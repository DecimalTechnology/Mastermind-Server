import mongoose from "mongoose";

export interface ITips extends mongoose.Document {
    title: string;
    userId: any;
    description: string;
    images?: string[];
    videos?: string[];
    isActive: boolean;
    likes: any;
    dislikes: any;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const tipsSchema = new mongoose.Schema<ITips>(
    {
        title: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        description: { type: String, required: true },
        images: { type: Array, required: false },
        videos: { type: Array, required: false },
        isActive: { type: Boolean, default: true },
        likes: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
        dislikes: { type: [mongoose.Schema.Types.ObjectId], ref: "User"},
        tags: { type: Array, required: false },
    },
    { timestamps: true }
);

export default mongoose.model<ITips>("Tips", tipsSchema);
