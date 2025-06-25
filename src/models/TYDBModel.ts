import mongoose, { Schema, Document } from "mongoose";
import { ITycb } from "../interfaces/models/ITycb";

export enum BusinessType {
  NEW = 'new',
  REPEAT = 'repeat'
}

const tycbSchema = new Schema<ITycb>(
  {
    fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    toUser:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message:  { type: String, required: true },
    businessType: {
      type: String,        
      enum: Object.values(BusinessType),
      required: true       
    },
    amount: { type: Number, required: true }
  },
  { timestamps: true }
);

const TYCB = mongoose.model<ITycb>("TYCB", tycbSchema);
export default TYCB;
