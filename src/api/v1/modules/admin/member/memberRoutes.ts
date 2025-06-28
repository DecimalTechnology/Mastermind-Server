import express from "express";
import { MemberRepository } from "./memberRepository";
import { MemberService } from "./memberService";
import { MemberController } from "./memberController";
import { UserRepository } from "../../shared/repositories/userRepository";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";
import roleAuth from "../../../../../middewares.ts/roleAuth";
import { UserRole } from "../../../../../enums/common";
import asyncHandler from "../../../../../validations/asyncHandler";

const memberRouter = express.Router();
const memberRepository = new MemberRepository();
const userRepository = new UserRepository();
const memberService = new MemberService(memberRepository, userRepository);
const controller = new MemberController(memberService);
const coreTeamAccess = [UserRole.SUPER_ADMIN,UserRole.REGIONAL_ADMIN,UserRole.LOCAL_ADMIN,UserRole.CORE_TEAM_ADMIN]

memberRouter.patch('/block/:id',adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.blockMember.bind(controller)))
memberRouter.patch('/unblock/:id',adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.unblockMember.bind(controller)))
memberRouter.patch('/accept/:id',adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.rejectMember.bind(controller)))
memberRouter.patch('/reject/:id',adminAuth,roleAuth(...coreTeamAccess),asyncHandler(controller.rejectMember.bind(controller)))
export default memberRouter;
