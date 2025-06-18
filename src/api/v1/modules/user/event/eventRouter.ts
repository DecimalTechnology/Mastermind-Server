import express from 'express';
import { EventRepository } from './eventRepository';
import { EventService } from './eventService';
import { EventController } from './eventController';
import asyncHandler from '../../../../../validations/asyncHandler';
import { authenticate } from '../../../../../middewares.ts/authenticate';
import { UserRepository } from '../../shared/repositories/userRepository';
import { ChapterRepository } from '../../admin/chapter/chapterRepository';

const eventRouter = express.Router();

const eventRepository = new EventRepository();
const chapterRepository  = new ChapterRepository()
const userRepository = new UserRepository()
const eventService = new EventService(eventRepository,userRepository,chapterRepository);
const controller = new EventController(eventService);

eventRouter.get('/',authenticate,asyncHandler(controller.getAllEvents.bind(controller)))

export default eventRouter;