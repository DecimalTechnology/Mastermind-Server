import { Server } from "./app";
import { connectDB } from "./config/connectDb";
// import './config/redisClient'
import dotenv from "dotenv";

import "./utils/v1/cron/index";
import seedAdmin from "./utils/seedAdmin";
import { generateSamlePassword } from "./utils/v1/samplePassword";
generateSamlePassword()

dotenv.config();
const PORT = process?.env.PORT || 3000;
connectDB();
// seedAdmin()
Server.listen(PORT, () => console.log(`Server Connected Successfully on ${PORT}`));

