import { Router } from "express";
import asyncHandler from "../../../../../validations/asyncHandler";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";
import roleAuth from "../../../../../middewares.ts/roleAuth";
import { UserRole } from "../../../../../enums/common";
import { AdminsService } from "./adminsService";
import { AdminsController } from "./adminsController";

const adminsService = new AdminsService();
const controller = new AdminsController(adminsService);
const adminsRouter = Router();

const allowedRoles = [UserRole.SUPER_ADMIN, UserRole.GLOBAL_ADMIN];

adminsRouter.get(
    "/search-users",
    adminAuth,
    roleAuth(...allowedRoles),
    asyncHandler(controller.searchUsers.bind(controller))
);

adminsRouter.post(
    "/assign-role",
    adminAuth,
    roleAuth(...allowedRoles),
    asyncHandler(controller.assignRole.bind(controller))
);

adminsRouter.get(
    "/regions",
    adminAuth,
    roleAuth(...allowedRoles),
    asyncHandler(controller.getRegions.bind(controller))
);

adminsRouter.get(
    "/locals",
    adminAuth,
    roleAuth(...allowedRoles),
    asyncHandler(controller.getLocals.bind(controller))
);

adminsRouter.get(
    "/chapters",
    adminAuth,
    roleAuth(...allowedRoles),
    asyncHandler(controller.getChapters.bind(controller))
);

export default adminsRouter;
