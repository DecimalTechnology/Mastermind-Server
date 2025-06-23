import mongoose, { Document } from "mongoose";
export interface ITycb extends Document {
    fromUser: any;
    toUser: any;
    message: string;
    businessType:any
    amount: number;
    _id:any;
    createdAt:Date;
    updatedAt:Date
}
