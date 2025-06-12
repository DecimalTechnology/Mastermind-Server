import express from 'express';
import { AuthRepository } from './authRepository';
import { AuthService } from './authService';
import { AuthController } from './authController';
import { authenticate } from '../../../../../middewares.ts/authenticate';
const authRouter = express.Router();
const authRepository = new AuthRepository();
const authService =  new AuthService(authRepository);
const controller =  new AuthController(authService);

// PWA 
authRouter.post("/register",(req,res,next)=>controller.registration(req,res,next));
authRouter.post('/signin',(req,res,next)=>controller.userLogin(req,res,next))
authRouter.patch('/password/reset',authenticate,(req,res,next)=>controller.resetPassword(req,res,next))
authRouter.post('/password/forget',(req,res,next)=>controller.forgetPassword(req,res,next))
authRouter.put('/password/forget',(req,res,next)=>controller.updateForgetPassword(req,res,next))
export default authRouter;
