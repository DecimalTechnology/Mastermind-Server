import mongoose from "mongoose";

export const testMonialRequestSchema = new mongoose.Schema(
    {
        toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

const AskTestimonial = mongoose.model("TestmonialRequest", testMonialRequestSchema);

export default AskTestimonial;
