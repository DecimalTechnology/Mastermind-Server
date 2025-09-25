import express from 'express'
import { TipsRepository } from './tipsRepository';
import { TipsService } from './tipsService';
import { TipsContoller } from './tipsController';
import { authenticate } from '../../../../../middewares.ts/authenticate';
import roleAuth from '../../../../../middewares.ts/roleAuth';
import { UserRole } from '../../../../../enums/common';

const tipsRouter =  express.Router();

const tipsRepository = new TipsRepository();
const tipsService = new TipsService(tipsRepository);
const controller = new TipsContoller(tipsService);

tipsRouter.get("/",authenticate,controller.getTip);



export default tipsRouter;