import express from "express";
import http from "http";
import authRouter from "./api/v1/modules/user/auth/authRoutes";
import { errorHandler } from "./middewares.ts/errorHandler";
import cookieParser from 'cookie-parser'
import profileRouter from "./api/v1/modules/user/profile/profileRoutes";
import { printBody } from "./middewares.ts/bodyLogger";
import dotenv from 'dotenv';
import { corsConfig } from "./config/corsConfig";
import userRouter from "./api/v1/modules/admin/auth/authRoutes";
import superAdminRouter from "./api/v1/modules/admin/superAdmin/route";


dotenv.config()
const app = express();
app.use(express.json());
app.use(corsConfig());
app.use(cookieParser())
app.use(printBody)

// Version 1
const version = process.env.API_VERSION

// User Routes
app.use(`/${version}/auth`, authRouter);
app.use(`/${version}/profile`, profileRouter)

// Admin Routes
app.use(`/${version}/admin`, userRouter);
app.use(`/${version}/superadmin`, superAdminRouter);
app.use(errorHandler);
export const Server = http.createServer(app);
