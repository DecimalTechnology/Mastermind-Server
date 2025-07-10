import express from "express";
import { ChapterRepository } from "./chapterRepository";
import { ChapterController } from "./chapterController";
import { ChapterService } from "./chapterService";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";
import asyncHandler from "../../../../../validations/asyncHandler";
import { UserRepository } from "../../shared/repositories/userRepository";
import { UserRole } from "../../../../../enums/common";
import roleAuth from "../../../../../middewares.ts/roleAuth";
import { LocalRepository } from "../local/localRepository";

const chapterRouter = express.Router()

const userRepository = new UserRepository()
const localRepository = new LocalRepository()
const chapterRepository = new ChapterRepository();
const chapterService = new ChapterService(chapterRepository,userRepository,localRepository);
const controller = new ChapterController(chapterService);

const allowedRoles = [UserRole.SUPER_ADMIN,UserRole.REGIONAL_ADMIN,UserRole.LOCAL_ADMIN]
const coreTeamAccess = [UserRole.SUPER_ADMIN,UserRole.REGIONAL_ADMIN,UserRole.LOCAL_ADMIN,UserRole.CORE_TEAM_ADMIN]

chapterRouter.post('/',adminAuth,roleAuth(...allowedRoles),asyncHandler(controller.createChapter.bind(controller)))
chapterRouter.get('/all',adminAuth,roleAuth(...allowedRoles),asyncHandler(controller.getAllChapters.bind(controller)));
chapterRouter.get("/users",adminAuth,roleAuth(...allowedRoles),asyncHandler(controller.getAllUsers.bind(controller)))
chapterRouter.get('/members/:id',adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.getAllMembers.bind(controller)));
chapterRouter.get('/members',adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.findMembers.bind(controller)))
chapterRouter.get("/:id",adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.getChapterById.bind(controller)))

export default chapterRouter;
