import express from 'express';
import { EventRepository } from './eventRepository';
import { EventService } from './eventService';
import { EventController } from './eventController';
import asyncHandler from '../../../../../validations/asyncHandler';
import { authenticate } from '../../../../../middewares.ts/authenticate';
import { UserRepository } from '../../shared/repositories/userRepository';
import { ChapterRepository } from '../../admin/chapter/chapterRepository';
import { MediaRepository } from '../../shared/media/mediaRepository';
import { AccountablityRepository } from '../accountabilitySlip/accountablitySilpRepository';
import { ProfileRepository } from '../profile/profileRepository';

const eventRouter = express.Router();

const eventRepository = new EventRepository();
const chapterRepository  = new ChapterRepository()
const mediaRepository = new  MediaRepository()
const profileRepository =  new ProfileRepository()
const userRepository = new UserRepository()
const accountablityRepository = new AccountablityRepository()
const eventService = new EventService(eventRepository,userRepository,chapterRepository,mediaRepository,accountablityRepository,profileRepository);
const controller = new EventController(eventService);

eventRouter.get('/',authenticate,asyncHandler(controller.getAllEvents.bind(controller)));
eventRouter.get("/media",authenticate,asyncHandler(controller.getAllMedia.bind(controller)))
eventRouter.patch('/register/:id',authenticate,asyncHandler(controller.registerEvent.bind(controller)))
eventRouter.delete('/register/:id',authenticate,asyncHandler(controller.cancelRegistration.bind(controller)))
eventRouter.get('/:id',authenticate,asyncHandler(controller.getEventById.bind(controller)))

export default eventRouter;