import { Schema, model } from 'mongoose';
import { IRegion } from '../interfaces/models/IRegion';

const regionSchema = new Schema<IRegion>({
  name: { type: String, required: true },
  nationId: { type: Schema.Types.ObjectId, ref: 'Nation' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, 
  isActive:{type:Boolean,default:true}// optional
},{timestamps:true});

export const Region = model<IRegion>('Region', regionSchema);
