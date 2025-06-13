import express from "express";
import { ChapterRepository } from "./chapterRepository";
import { ChapterController } from "./chapterController";
import { ChapterService } from "./chapterService";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";
import asyncHandler from "../../../../../validations/asyncHandler";

const chapterRouter = express.Router();

const chapterRepository = new ChapterRepository();
const chapterService = new ChapterService(chapterRepository);
const controller = new ChapterController(chapterService);

chapterRouter.post('/',asyncHandler(controller.createChapter.bind(controller)))
chapterRouter.get('/all',asyncHandler(controller.getAllChapters.bind(controller)))


export default chapterRouter;
