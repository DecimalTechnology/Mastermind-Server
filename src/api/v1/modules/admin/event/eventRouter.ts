import express from "express";
import { EventRepository } from "./eventRepository";
import { EventServices } from "./eventServices";
import { EventController } from "./eventController";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";
import { UserRole } from "../../../../../enums/common";
import roleAuth from "../../../../../middewares.ts/roleAuth";
import asyncHandler from "../../../../../validations/asyncHandler";
import upload from "../../../../../middewares.ts/upload";
import { ReportRepository } from "../../shared/repositories/reportRepository";
import uploadImageS3 from "../../../../../utils/v1/s3/image/uploadImageS3";
import { MediaRepository } from "../../shared/media/mediaRepository";
import uploadMediaS3 from "../../../../../utils/v1/s3/image/uploadImageS3";
import uploadPdfS3 from "../../../../../utils/v1/s3/uploadPdf";

const eventRouter = express.Router();

const eventRepository = new EventRepository();
const reportRepository = new ReportRepository();
const mediaRepository = new MediaRepository();
const eventServices = new EventServices(eventRepository, reportRepository, mediaRepository);
const controller = new EventController(eventServices);

const allowedRoles = [UserRole.SUPER_ADMIN, UserRole.REGIONAL_ADMIN, UserRole.LOCAL_ADMIN];
const coreTeamAccess = [UserRole.SUPER_ADMIN, UserRole.REGIONAL_ADMIN, UserRole.LOCAL_ADMIN, UserRole.CORE_TEAM_ADMIN];

eventRouter.get("/media/:eventId", adminAuth, roleAuth(...coreTeamAccess), asyncHandler(controller.getAllMedia.bind(controller)));
eventRouter.get("/users", adminAuth, roleAuth(...coreTeamAccess), asyncHandler(controller.getAllUsersByLevel.bind(controller)));

// upload image routes
eventRouter.post(
    "/upload-images",
    adminAuth,
    roleAuth(...coreTeamAccess),
    uploadMediaS3.fields([{ name: "images" }]),
    asyncHandler(controller.uploadImageMedia.bind(controller))
);

// upload videos route
eventRouter.post(
    "/upload-videos",
    adminAuth,
    roleAuth(...coreTeamAccess),
    uploadImageS3.fields([{ name: "videos" }]),
    asyncHandler(controller.uploadVideos.bind(controller))
);
eventRouter.post(
    "/chapter/report",
    adminAuth,
    roleAuth(...coreTeamAccess),
    uploadPdfS3.single("file"),
    asyncHandler(controller.createChapterEventReport.bind(controller))
);
eventRouter.post("/", adminAuth, roleAuth(...coreTeamAccess), upload.any(), asyncHandler(controller.createEvent.bind(controller)));
eventRouter.get("/chapter/:id", adminAuth, roleAuth(...coreTeamAccess), upload.any(), asyncHandler(controller.getAllEvents.bind(controller)));
eventRouter.get(
    "/attendees/:id",
    adminAuth,
    roleAuth(...coreTeamAccess),
    upload.any(),
    asyncHandler(controller.getAllAttendeesList.bind(controller))
);
eventRouter.get("/rsvp/:id", adminAuth, roleAuth(...coreTeamAccess), upload.any(), asyncHandler(controller.findAllRsvpUsersList.bind(controller)));
eventRouter.patch("/:id", adminAuth, roleAuth(...coreTeamAccess), upload.any(), asyncHandler(controller.eventParialUpdate.bind(controller)));
eventRouter.post("/cancel/:id", adminAuth, roleAuth(...coreTeamAccess), upload.any(), asyncHandler(controller.cancelEvent.bind(controller)));
eventRouter.put("/:id", adminAuth, roleAuth(...coreTeamAccess), upload.any(), asyncHandler(controller.updateEvent.bind(controller)));
eventRouter.get("/:id", adminAuth, roleAuth(...coreTeamAccess), upload.any(), asyncHandler(controller.getEventById.bind(controller)));
export default eventRouter;
