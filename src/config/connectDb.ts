import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
export const connectDB = async () => {
  try {

    await mongoose.connect(`mongodb+srv://developer:ee5KMl0yBq0dgTDV@cluster0.lpxu2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    console.log("MongoDB Connected");
  } catch (error: any) {
   console.log(error) // Throw error to be caught in the main app file
  }
};
