import { Schema, model } from 'mongoose';
import { INation } from '../interfaces/models/INation';


const nationSchema = new Schema<INation>({
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive:{type:Boolean,default:true} // optional
},{timestamps:true});

export const Nation = model<INation>('Nation', nationSchema);
