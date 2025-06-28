import express from 'express';
import { AuthRepository } from './authRepository';
import { AuthService } from './authService';
import { AuthController } from './authController';
import { authenticate } from '../../../../../middewares.ts/authenticate';
import { NationRepository } from '../../admin/nation/repository';
import { RegionRepository } from '../../admin/region/regionRepository';
import { LocalRepository } from '../../admin/local/localRepository';
import { ChapterRepository } from '../../admin/chapter/chapterRepository';
const authRouter = express.Router();
const nationRepository = new NationRepository();
const regionRepository =  new RegionRepository();
const localRepository = new LocalRepository();
const chapterRepository =  new ChapterRepository();
const authRepository = new AuthRepository();
const authService =  new AuthService(authRepository,nationRepository,regionRepository,localRepository,chapterRepository);
const controller =  new AuthController(authService);

// PWA 
authRouter.post("/register",(req,res,next)=>controller.registration(req,res,next));
authRouter.post("/send-otp",(req,res,next)=>controller.sendOtp(req,res,next));
authRouter.post("/verify-otp",(req,res,next)=>controller.verifyOtp(req,res,next));
authRouter.post('/signin',(req,res,next)=>controller.userLogin(req,res,next))
authRouter.patch('/password/reset',authenticate,(req,res,next)=>controller.resetPassword(req,res,next))
authRouter.post('/password/forget',(req,res,next)=>controller.forgetPassword(req,res,next))
authRouter.put('/password/forget',(req,res,next)=>controller.updateForgetPassword(req,res,next))
authRouter.get('/nations',(req,res,next)=>controller.getAllNations(req,res,next))
authRouter.get('/regions',(req,res,next)=>controller.getAllRegions(req,res,next))
authRouter.get('/locals',(req,res,next)=>controller.getAllLocals(req,res,next))
authRouter.get('/chapters',(req,res,next)=>controller.getAllChapters(req,res,next))
export default authRouter;
