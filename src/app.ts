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
import nationRouter from "./api/v1/modules/admin/nation/route";
import chapterRouter from "./api/v1/modules/admin/chapter/chapterRoutes";
import regionRouter from "./api/v1/modules/admin/region/regionRoutes";
import localRouter from "./api/v1/modules/admin/local/localRoutes";
import eventRouter from "./api/v1/modules/admin/event/eventRouter";
import userEventRouter from './api/v1/modules/user/event/eventRouter'


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
app.use(`/${version}/events`, userEventRouter)

// Admin Routes
app.use(`/${version}/admin/auth`, userRouter);
app.use(`/${version}/admin/nation`, nationRouter);
app.use(`/${version}/admin/chapter`,chapterRouter)
app.use(`/${version}/admin/region`,regionRouter)
app.use(`/${version}/admin/local`,localRouter);
app.use(`/${version}/admin/event`,eventRouter)

// Error handler
app.use(errorHandler);
export const Server = http.createServer(app);
