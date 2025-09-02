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
import { AccountablityRepository } from "../../user/accountabilitySlip/accountablitySilpRepository";
import { MediaRepository } from "../../shared/media/mediaRepository";
import { EventRepository } from "../event/eventRepository";

const chapterRouter = express.Router()

const userRepository = new UserRepository()
const localRepository = new LocalRepository()
const chapterRepository = new ChapterRepository();
const accountablityRepository = new AccountablityRepository()
const mediaRepository = new MediaRepository()
const eventRepository = new EventRepository()
const chapterService = new ChapterService(chapterRepository,userRepository,localRepository,accountablityRepository,mediaRepository,eventRepository);
const controller = new ChapterController(chapterService);

const allowedRoles = [UserRole.SUPER_ADMIN,UserRole.REGIONAL_ADMIN,UserRole.LOCAL_ADMIN]
const coreTeamAccess = [UserRole.SUPER_ADMIN,UserRole.REGIONAL_ADMIN,UserRole.LOCAL_ADMIN,UserRole.CORE_TEAM_ADMIN,UserRole.CHAPTER_ADMIN]

chapterRouter.post('/',adminAuth,roleAuth(...allowedRoles),asyncHandler(controller.createChapter.bind(controller)))
chapterRouter.get('/all',adminAuth,roleAuth(...allowedRoles),asyncHandler(controller.getAllChapters.bind(controller)));
chapterRouter.get("/users",adminAuth,roleAuth(...allowedRoles),asyncHandler(controller.getAllUsers.bind(controller)))
chapterRouter.get('/members/:id',adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.getAllMembers.bind(controller)));
chapterRouter.get('/members',adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.findMembers.bind(controller)))
chapterRouter.get("/profile",adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.getProfile.bind(controller)))

chapterRouter.get("/meeting/members/:chapterId",adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.getAllChapterMembers.bind(controller)))
chapterRouter.post("/meeting",adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.createMeeting.bind(controller)))
chapterRouter.get("/meeting",adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.getAllMeeting.bind(controller)))
chapterRouter.get("/:id",adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.getChapterById.bind(controller)));
chapterRouter.get("/media/:chapterId",adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.getAllMedia.bind(controller)))
export default chapterRouter;
