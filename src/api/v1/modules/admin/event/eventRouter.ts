import express from "express";
import { EventRepository } from "./eventRepository";
import { EventServices } from "./eventServices";
import { EventController } from "./eventController";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";
import { UserRole } from "../../../../../enums/common";
import roleAuth from "../../../../../middewares.ts/roleAuth";
import asyncHandler from "../../../../../validations/asyncHandler";
import upload from "../../../../../middewares.ts/upload";

const eventRouter = express.Router();

const eventRepository = new EventRepository();
const eventServices = new EventServices(eventRepository);
const controller = new EventController(eventServices);

const allowedRoles = [UserRole.SUPER_ADMIN, UserRole.REGIONAL_ADMIN, UserRole.LOCAL_ADMIN];
const coreTeamAccess = [UserRole.SUPER_ADMIN, UserRole.REGIONAL_ADMIN, UserRole.LOCAL_ADMIN, UserRole.CORE_TEAM_ADMIN];

eventRouter.get("/users", adminAuth, roleAuth(...coreTeamAccess), asyncHandler(controller.getAllUsersByLevel.bind(controller)));
eventRouter.post("/", adminAuth, roleAuth(...coreTeamAccess), upload.any(), asyncHandler(controller.createEvent.bind(controller)));
eventRouter.get("/", adminAuth, roleAuth(...coreTeamAccess), upload.any(), asyncHandler(controller.getAllEvents.bind(controller)));

export default eventRouter;
