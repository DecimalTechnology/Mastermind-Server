import mongoose, { Document } from 'mongoose'
import { UserRole } from '../../enums/common';
export interface IUser extends Document {
    name: string;
    email: string;
    phonenumber: number;
    password?: string;
    _id:any

    role: UserRole;

    // Belonging info (for members mostly)
    nation?: mongoose.Types.ObjectId;
    region?: mongoose.Types.ObjectId;
    chapter?: mongoose.Types.ObjectId;
    local?: mongoose.Types.ObjectId;

    // What the user manages (only one allowed at a time)
    manage?: {
        country?: mongoose.Types.ObjectId;
        region?: mongoose.Types.ObjectId;
        chapter?: mongoose.Types.ObjectId;
    };

    isVerified: boolean;
    isBlocked: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}