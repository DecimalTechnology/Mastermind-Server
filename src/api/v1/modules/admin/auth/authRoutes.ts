import express from "express";
import { AuthRepository } from "./authRepository";
import { AuthService } from "./authServices";
import { AuthController } from "./authController";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";
import { ProfileRepository } from "../../user/profile/profileRepository";

const authRouter = express.Router();
const authRepository = new AuthRepository();
const profileRepository = new ProfileRepository()
const authService = new AuthService(authRepository,profileRepository);
const controller = new AuthController(authService);

authRouter.post("/login", (req, res, next) => controller.adminLogin(req, res, next));
authRouter.post("/refresh_token", (req, res, next) => controller.refreshToken(req, res, next));
authRouter.get("/users",(req,res,next)=>controller.getAllUsers(req,res,next));
authRouter.get("/users",(req,res,next)=>controller.getAllUsers(req,res,next));
authRouter.patch("/user/approve",(req,res,next)=>controller.approveUser(req,res,next));

// Chapter Routes

export default authRouter;
