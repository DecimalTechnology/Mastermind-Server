import { Document } from "mongoose";

export interface IAccountablity extends Document {
    userId:any
    place: string;
    members: any;
    time: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    _id: any;
}
