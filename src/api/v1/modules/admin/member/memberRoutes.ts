import express from "express";
import { MemberRepository } from "./memberRepository";
import { MemberService } from "./memberService";
import { MemberController } from "./memberController";
import { UserRepository } from "../../shared/repositories/userRepository";
import { adminAuth } from "../../../../../middewares.ts/authenticateAdmin";
import roleAuth from "../../../../../middewares.ts/roleAuth";
import { UserRole } from "../../../../../enums/common";
import asyncHandler from "../../../../../validations/asyncHandler";
import { ProfileRepository } from "../../user/profile/profileRepository";

const memberRouter = express.Router();
const memberRepository = new MemberRepository();
const userRepository = new UserRepository();
const profileRepository = new ProfileRepository()
const memberService = new MemberService(memberRepository, userRepository,profileRepository);
const controller = new MemberController(memberService);
const access = [UserRole.SUPER_ADMIN,UserRole.REGIONAL_ADMIN,UserRole.LOCAL_ADMIN,UserRole.CORE_TEAM_ADMIN]

memberRouter.patch('/block/:id',adminAuth,roleAuth(...access),asyncHandler(controller.blockMember.bind(controller)))
memberRouter.patch('/unblock/:id',adminAuth,roleAuth(...access),asyncHandler(controller.unblockMember.bind(controller)))
memberRouter.patch('/accept/:id',adminAuth,roleAuth(...access),asyncHandler(controller.acceptUser.bind(controller)))
memberRouter.patch('/reject/:id',adminAuth,roleAuth(...access),asyncHandler(controller.rejectMember.bind(controller)))
memberRouter.patch('/reject/:id',adminAuth,roleAuth(...access),asyncHandler(controller.rejectMember.bind(controller)))
memberRouter.get('/all',adminAuth,roleAuth(...access),asyncHandler(controller.getAllMembers.bind(controller)))
export default memberRouter;
