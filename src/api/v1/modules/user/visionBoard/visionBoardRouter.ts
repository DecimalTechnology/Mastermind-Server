import express from 'express'
import { authenticate } from '../../../../../middewares.ts/authenticate';
import asyncHandler from '../../../../../validations/asyncHandler';
import { VisionBoardRepository } from './visionBoardRepository';
import { VisionboardService } from './visionBoardService';
import { VisionboardController } from './visionBoardController';

const visionBoardRouter =  express.Router();

const visionboardRepository  = new VisionBoardRepository();
const visionBoardService =  new VisionboardService(visionboardRepository);
const controller = new VisionboardController(visionBoardService)

visionBoardRouter.post("/",authenticate,asyncHandler(controller.createVisionBoard.bind(controller)));
visionBoardRouter.delete('/',authenticate,asyncHandler(controller.deleteGoal.bind(controller)));
visionBoardRouter.patch("/",authenticate,asyncHandler(controller.updateGoal.bind(controller)))
visionBoardRouter.get("/:year",authenticate,asyncHandler(controller.getVisionBoard.bind(controller)))

export default visionBoardRouter;
