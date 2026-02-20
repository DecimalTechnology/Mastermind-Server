
import express from 'express';
import { adminAuth } from '../../../../../middewares.ts/authenticateAdmin';
import roleAuth from '../../../../../middewares.ts/roleAuth';
import { UserRole } from '../../../../../enums/common';
import { MeetingController } from './meetingController';


const meetingController =  new MeetingController()

const meetingRoutes  = express.Router();
const access = [UserRole.SUPER_ADMIN,UserRole.REGIONAL_ADMIN,UserRole.LOCAL_ADMIN,UserRole.CORE_TEAM_ADMIN]
meetingRoutes.post("/",adminAuth,roleAuth(...access),meetingController.createMeeting);
meetingRoutes.get("/",adminAuth,roleAuth(...access),meetingController.getAllMeeting);
meetingRoutes.put("/:meetingId",adminAuth,roleAuth(...access),meetingController.updateMeetings);

export default meetingRoutes;