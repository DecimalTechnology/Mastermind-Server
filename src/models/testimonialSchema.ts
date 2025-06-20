import { Schema, model, Types } from "mongoose";
import { ITestimonial } from "../interfaces/models/Testimonial";

const TestimonialSchema = new Schema<ITestimonial>({
  fromUser: { type: Types.ObjectId, ref: "User", required: true },
  toUser: { type: Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
},{timestamps:true});

const Testimonial =  model<ITestimonial>("Testimonial", TestimonialSchema);
export default Testimonial;


