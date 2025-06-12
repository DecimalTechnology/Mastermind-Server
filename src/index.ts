import { Server } from "./app";
import { connectDB } from "./config/connectDb";
import dotenv from 'dotenv';
dotenv.config() 
const PORT = process?.env.PORT||3000
connectDB()
Server.listen(PORT, () => console.log(`Server Connected Successfully on ${PORT}`));
