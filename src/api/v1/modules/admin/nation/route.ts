import express from "express";
import { NationController } from "./controller";
import asyncHandler from "../../../../../validations/asyncHandler";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";
import { UserRepository } from "../../shared/repositories/userRepository";
import { NationRepository } from "./repository";
import { NationServices } from "./services";
import roleAuth from "../../../../../middewares.ts/roleAuth";
import { UserRole } from "../../../../../enums/common";

const nationRouter = express.Router();
const nationRepository = new NationRepository();
const userRepository = new UserRepository();

const nationService = new NationServices(nationRepository, userRepository);
const controller = new NationController(nationService);

nationRouter.post("/", adminAuth,roleAuth(UserRole.SUPER_ADMIN), asyncHandler(controller.createNation.bind(controller)));
nationRouter.get("/", adminAuth, roleAuth(UserRole.SUPER_ADMIN), asyncHandler(controller.getAllNations.bind(controller)));
nationRouter.get("/users", adminAuth,roleAuth(UserRole.SUPER_ADMIN,UserRole.NATIONAL_ADMIN), asyncHandler(controller.findUsers.bind(controller)));

export default nationRouter;
