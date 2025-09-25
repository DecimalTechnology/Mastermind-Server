import express from "express";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";
import roleAuth from "../../../../../middewares.ts/roleAuth";
import { UserRole } from "../../../../../enums/common";
import { TipsRepository } from "./tipsRepository";
import { TipsContoller } from "./tipsController";
import { TipsService } from "./tipsService";
import { upload } from "../../../../../utils/upload";

const tipsRouter = express.Router();

const tipsRepository =  new TipsRepository();
const tipsService =  new TipsService(tipsRepository);
const controller = new TipsContoller(tipsService);

tipsRouter.post("/", adminAuth, roleAuth(UserRole.SUPER_ADMIN),upload.any(), controller.createTips);

export default tipsRouter;
