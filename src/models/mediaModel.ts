import mongoose from "mongoose";

export enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
}

const imageMediaSchema = new mongoose.Schema({
    type: { type: String, enum: Object.values(MediaType), required: true },
    urls: { type: Array, required: true },
    uploadedAt: { type: Date, required: true },
    uploadedBy: { type: String, required: true },
});

const gallerySchema = new mongoose.Schema(
    {
        relatedTo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "relatedModel",
        },
        relatedModel: {
            type: String,
            required: true,
            enum: ["Event", "Post", "Product", "User"],
        },
        media: { type: [imageMediaSchema], default: [] },
    },
    { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
