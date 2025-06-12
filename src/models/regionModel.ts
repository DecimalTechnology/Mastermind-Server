import { Schema, model } from 'mongoose';

const regionSchema = new Schema({
  name: { type: String, required: true },
  nationId: { type: Schema.Types.ObjectId, ref: 'Nation' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, 
  isActive:{type:Boolean,default:true}// optional
},{timestamps:true});

export const Region = model('Region', regionSchema);
