import express from "express";
import { ProfileRepository } from "./profileRepository";
import { ProfileService } from "./profileService";
import { ProfileController } from "./profileController";
import { authenticate } from "../../../../../middewares.ts/authenticate";
import upload from "../../../../../middewares.ts/upload";
import { ChapterRepository } from "../../admin/chapter/chapterRepository";
import { UserRepository } from "../../shared/repositories/userRepository";
import { AccountablityRepository } from "../accountabilitySlip/accountablitySilpRepository";
import { EventRepository } from "../event/eventRepository";


const profileRouter = express.Router();
const profileRepository = new ProfileRepository();
const chapterRepository = new ChapterRepository();
const accountablityRepository = new AccountablityRepository();
const eventRepository = new EventRepository()
const userRepository = new UserRepository();
const profileService = new ProfileService(profileRepository, chapterRepository,userRepository,accountablityRepository,eventRepository);
const controller = new ProfileController(profileService);


profileRouter.put("/", authenticate, (req, res, next) => controller.updateProfile(req, res, next));
profileRouter.get("/home", authenticate,(req, res, next) => controller.getHomeProfile(req, res, next));
profileRouter.get("/", authenticate, (req, res, next) => controller.getProfile(req, res, next));
profileRouter.patch("/profile-picture", upload.any(), authenticate, (req, res, next) => controller.updateProfilePicture(req, res, next));
profileRouter.post("/search", authenticate, (req, res, next) => controller.searchProfile(req, res, next));
profileRouter.post("/connect", authenticate, (req, res, next) => controller.connectUser(req, res, next));
profileRouter.patch("/connect/accept", authenticate, (req, res, next) => controller.acceptConnection(req, res, next));
profileRouter.patch("/connect/remove", authenticate, (req, res, next) => controller.removeConnection(req, res, next));
profileRouter.patch("/connect/cancel", authenticate, (req, res, next) => controller.cancelConnection(req, res, next));
profileRouter.get("/connect/all", authenticate, (req, res, next) => controller.getConnections(req, res, next));
profileRouter.get("/connect/sent", authenticate, (req, res, next) => controller.getSendRequests(req, res, next));
profileRouter.get("/connect/received", authenticate, (req, res, next) => controller.getReceiveRequests(req, res, next));
profileRouter.get("/connect/connections", authenticate, (req, res, next) => controller.getAllConnections(req, res, next));
profileRouter.get("/:id", authenticate, (req, res, next) => controller.getProfileById(req, res, next));
export default profileRouter;
