import { Schema, model } from 'mongoose';

const localShema = new Schema({
  name: { type: String, required: true },
  nationId: { type: Schema.Types.ObjectId, ref: 'Nation' },
  regionId:{type:Schema.Types.ObjectId,ref:'Region'},
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  isActive:{type:Boolean,default:true} // optional
},{timestamps:true});

export const Local = model('Local', localShema);
