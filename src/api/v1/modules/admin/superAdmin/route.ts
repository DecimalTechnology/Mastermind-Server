import express from "express"
import { SuperAdminService } from "./services";
import { SuperAdminRepository } from "./repository";
import { SuperAdminController } from "./controller";
import { createConnection } from "mongoose";
import asyncHandler from "../../../../../validations/asyncHandler";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";

import User from "../../../../../models/userModel";
import { Nation } from "../../../../../models/nationModel";
import { UserRepository } from "../../shared/repositories/userRepository";
import { NationRepository } from "../../shared/repositories/nationRepository";

const superAdminRouter = express.Router();
const repository = new SuperAdminRepository();
const userRepository = new UserRepository();
const nationRepository = new NationRepository()
const service = new SuperAdminService(repository,nationRepository,userRepository);
const controller = new SuperAdminController(service);


superAdminRouter.post('/nation', adminAuth,asyncHandler(controller.createNation.bind(controller)))
superAdminRouter.get('/nations', adminAuth,asyncHandler(controller.getAllNations.bind(controller)))
superAdminRouter.get('/nation/users',adminAuth, asyncHandler(controller.findUsers.bind(controller)))





export default superAdminRouter;