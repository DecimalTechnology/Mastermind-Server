import express from 'express';
import { TestimonialRepository } from './testimonialRepository';
import { UserRepository } from '../../shared/repositories/userRepository';
import { TestimonialService } from './testimonialService';
import { TestimonialController } from './testimonialController';

const testMonialRouter =  express.Router();

const testimonialRepository  = new TestimonialRepository();
const userRepository =  new UserRepository();

const testimonialService = new TestimonialService(testimonialRepository,userRepository);
const controller = new TestimonialController(testimonialService);


export default testMonialRouter;