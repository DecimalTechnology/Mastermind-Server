import express from 'express'
import { TYCBRepository } from './TYCBRepository';
import { TYCBServices } from './TYCBServices';
import {TYCBController} from './TYCBController'
import asyncHandler from '../../../../../validations/asyncHandler';
import { authenticate } from '../../../../../middewares.ts/authenticate';
import { UserRepository } from '../../shared/repositories/userRepository';

const tycbRouter = express.Router();

const tycbRepository = new TYCBRepository();
const userRepository = new UserRepository()
const tycbService = new TYCBServices(tycbRepository,userRepository);
const controller = new TYCBController(tycbService);

tycbRouter.post('/:id',authenticate, asyncHandler(controller.createTycb.bind(controller)));
tycbRouter.get('/received',authenticate,asyncHandler(controller.getAllTycb.bind(controller)));
tycbRouter.get('/sent',authenticate,asyncHandler(controller.getAllSentTycb.bind(controller)));


export default tycbRouter; 