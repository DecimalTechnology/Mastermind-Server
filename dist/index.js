"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const connectDb_1 = require("./config/connectDb");
// import './config/redisClient'
const dotenv_1 = __importDefault(require("dotenv"));
require("./utils/v1/cron/updateEventStatus");
dotenv_1.default.config();
const PORT = (process === null || process === void 0 ? void 0 : process.env.PORT) || 3000;
(0, connectDb_1.connectDB)();
app_1.Server.listen(PORT, () => console.log(`Server Connected Successfully on ${PORT}`));
// Entry point
