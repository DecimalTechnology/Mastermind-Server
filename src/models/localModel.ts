import { Schema, model } from 'mongoose';
import { ILocal } from '../interfaces/models/ILocal';

const localSchema = new Schema<ILocal>({
  name: { type: String, required: true },
  nationId: { type: Schema.Types.ObjectId, ref: 'Nation' },
  regionId:{type:Schema.Types.ObjectId,ref:'Region'},
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  isActive:{type:Boolean,default:true} // optional
},{timestamps:true});

export const Local = model<ILocal>('Local', localSchema);
