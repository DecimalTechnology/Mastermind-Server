import express from "express";
import http from "http";
import authRouter from "./api/v1/modules/user/auth/authRoutes";
import { errorHandler } from "./middewares.ts/errorHandler";
import cookieParser from 'cookie-parser'
import profileRouter from "./api/v1/modules/user/profile/profileRoutes";
import morgan from 'morgan'
import dotenv from 'dotenv';
import { corsConfig } from "./config/corsConfig";
import userRouter from "./api/v1/modules/admin/auth/authRoutes";
import nationRouter from "./api/v1/modules/admin/nation/route";
import chapterRouter from "./api/v1/modules/admin/chapter/chapterRoutes";
import regionRouter from "./api/v1/modules/admin/region/regionRoutes";
import localRouter from "./api/v1/modules/admin/local/localRoutes";
import eventRouter from "./api/v1/modules/admin/event/eventRouter";
import userEventRouter from './api/v1/modules/user/event/eventRouter'
import testMonialRouter from "./api/v1/modules/user/testimonial/testimonialRoutes";
import tycbRouter from "./api/v1/modules/user/TYCB/TYCBRoutes";
import accountabilityRouter from "./api/v1/modules/user/accountabilitySlip/accountablitySlipRouter";
import memberRouter from "./api/v1/modules/admin/member/memberRoutes";
import visionBoardRouter from "./api/v1/modules/user/visionBoard/visionBoardRouter";
import tipsRouter from "./api/v1/modules/admin/tips/tipsRoutes";
import tipsUserRouter from './api/v1/modules/user/tips/tipsRouter' 
import discountRouter from "./api/v1/modules/admin/discount/discountRouter";
import discountUserRouter from "./api/v1/modules/user/discount/discountRouter";



dotenv.config()
const app = express();
app.use(express.json());
app.use(corsConfig());
app.use(cookieParser())
app.use(morgan("dev")); 
// app.use(printBody)

// Version 1
const version = process.env.API_VERSION

// User Routes
app.use(`/${version}/auth`, authRouter);
app.use(`/${version}/profile`, profileRouter)
app.use(`/${version}/events`, userEventRouter)
app.use(`/${version}/testimonial`, testMonialRouter)
app.use(`/${version}/tycb`, tycbRouter);
app.use(`/${version}/accountability`,accountabilityRouter);
app.use(`/${version}/visionboard`,visionBoardRouter);
app.use(`/${version}/tips`,tipsUserRouter);
app.use(`/${version}/discounts`,discountUserRouter);




// Admin Routes
app.use(`/${version}/admin/auth`, userRouter);
app.use(`/${version}/admin/nation`, nationRouter);
app.use(`/${version}/admin/chapter`,chapterRouter)
app.use(`/${version}/admin/region`,regionRouter)
app.use(`/${version}/admin/local`,localRouter);
app.use(`/${version}/admin/event`,eventRouter)
app.use(`/${version}/admin/member`,memberRouter)
app.use(`/${version}/admin/tips`, tipsRouter);
app.use(`/${version}/admin/discounts`, discountRouter);


// Error handler
app.use(errorHandler);
export const Server = http.createServer(app);
