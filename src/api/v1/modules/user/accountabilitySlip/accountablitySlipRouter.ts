import express from 'express'
import { AccountablityRepository } from './accountablitySilpRepository';
import { AccountabilitySliService } from './accountabilitySlicService';
import { AccountabilityController } from './accountabilitySlipController';
import asyncHandler from '../../../../../validations/asyncHandler';
import { authenticate } from '../../../../../middewares.ts/authenticate';

const accountabilityRouter = express.Router();

const accountablityRepository = new AccountablityRepository();
const accountabilityService =  new AccountabilitySliService(accountablityRepository);
const controller = new AccountabilityController(accountabilityService);

accountabilityRouter.post("/",authenticate,asyncHandler(controller.createSlip.bind(controller)));
accountabilityRouter.get("/",authenticate,asyncHandler(controller.getAllSlips.bind(controller)))
accountabilityRouter.get("/:id",authenticate,asyncHandler(controller.getSlipById.bind(controller)))
accountabilityRouter.put("/:id",authenticate,asyncHandler(controller.updateAccountabilitySlip.bind(controller)))
accountabilityRouter.delete("/:id",authenticate,asyncHandler(controller.deleteAccountabilitySlip.bind(controller)))




export default accountabilityRouter;