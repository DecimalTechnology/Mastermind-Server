import mongoose, { Document } from "mongoose";

export interface ITestimonial extends Document {
    fromUser: { type: mongoose.Schema.Types.ObjectId; ref: "User" };
    toUser: { type: mongoose.Schema.Types.ObjectId; ref: "User" };
    message: { type: String; required: true };
    createdAt: Date;
    updatedAt: Date;

}


 