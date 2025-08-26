import { Server } from "./app";
import { connectDB } from "./config/connectDb";
// import './config/redisClient'
import dotenv from "dotenv";

import "./utils/v1/cron/updateEventStatus";

dotenv.config();
const PORT = process?.env.PORT || 3000;
connectDB();
Server.listen(PORT, () => console.log(`Server Connected Successfully on ${PORT}`));
