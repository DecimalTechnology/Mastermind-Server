import express from 'express';
import { MeetingController } from './meetingController';

import { authenticate } from '../../../../../middewares.ts/authenticate';
import { MeetingRepository } from './meetingRepository';
import { MeetingServices } from './meetingServices';

const userMeetingRoutes = express.Router();
const meetingRepository = new MeetingRepository();
const meetingServices = new MeetingServices(MeetingRepository)
const meetingController = new MeetingController(meetingServices);

userMeetingRoutes.get("/",authenticate,meetingController.getAllUserMeetings)
userMeetingRoutes.get("/:meetingId",authenticate,meetingController.getMeetingById)

export default userMeetingRoutes;