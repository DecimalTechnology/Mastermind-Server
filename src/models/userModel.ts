import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/models/IUser";
import { UserRole } from "../enums/common";

const userSchema = new mongoose.Schema<IUser>(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phonenumber: { type: Number, required: true },
        password: { type: String },

        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
            default: UserRole.MEMBER,
        },

        // Where the user belongs
        // nation: { type: Schema.Types.ObjectId, ref: 'Nation', default: null },
        // region: { type: Schema.Types.ObjectId, ref: 'Region', default: null },
        chapter: { type: Schema.Types.ObjectId, ref: 'Chapter', default: null },

        // What the user manages
        manage: {
            type: Object,
            default: null, // or use {} if you prefer empty object
        },


        isVerified: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
    },
    { timestamps: true }
);
const User = mongoose.model<IUser>('User', userSchema);
export default User;