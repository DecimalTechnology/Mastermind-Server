import express from "express";
import { LocalRepository } from "./localRepository";
import { LocalServices } from "./localServices";
import { LocalController } from "./localController";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";
import roleAuth from "../../../../../middewares.ts/roleAuth";
import { UserRole } from "../../../../../enums/common";
import asyncHandler from "../../../../../validations/asyncHandler";
import { UserRepository } from "../../shared/repositories/userRepository";

const localRouter = express.Router();

const localRepository = new LocalRepository();
const userRepository = new UserRepository()
const localServices = new LocalServices(localRepository,userRepository);
const controller = new LocalController(localServices);

const accessRoles = [UserRole.SUPER_ADMIN,UserRole.NATIONAL_ADMIN,UserRole.REGIONAL_ADMIN];
const chapterAdminAccess = [UserRole.SUPER_ADMIN,UserRole.NATIONAL_ADMIN,UserRole.REGIONAL_ADMIN,UserRole.CHAPTER_ADMIN];

localRouter.get("/users", adminAuth,roleAuth(...accessRoles),asyncHandler(controller.getAllUsers.bind(controller)));
localRouter.get("/",adminAuth,roleAuth(...accessRoles),asyncHandler(controller.getAllLocals.bind(controller)));
localRouter.post("/",adminAuth,roleAuth(...accessRoles),asyncHandler(controller.createLocalArea.bind(controller)));
localRouter.post("/:id",adminAuth,roleAuth(...chapterAdminAccess),asyncHandler(controller.findLocalById.bind(controller)));

export default localRouter;
