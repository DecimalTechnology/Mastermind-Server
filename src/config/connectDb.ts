import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
export const connectDB = async () => {
  try {

    await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`);
    console.log("MongoDB Connected");
  } catch (error: any) {
   console.log(error) 
  }
};
