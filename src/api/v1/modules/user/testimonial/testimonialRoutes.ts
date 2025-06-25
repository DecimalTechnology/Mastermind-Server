import express from "express";
import { TestimonialRepository } from "./testimonialRepository";
import { UserRepository } from "../../shared/repositories/userRepository";
import { TestimonialService } from "./testimonialService";
import { TestimonialController } from "./testimonialController";
import asyncHandler from "../../../../../validations/asyncHandler";
import { authenticate } from "../../../../../middewares.ts/authenticate";

const testMonialRouter = express.Router();

const testimonialRepository = new TestimonialRepository();
const userRepository = new UserRepository();

const testimonialService = new TestimonialService(testimonialRepository, userRepository);
const controller = new TestimonialController(testimonialService);

testMonialRouter.post("/give/:id", authenticate, asyncHandler(controller.createTestimonial.bind(controller)));
testMonialRouter.post("/ask/:id", authenticate, asyncHandler(controller.createAskTestimonial.bind(controller)));
testMonialRouter.get("/given", authenticate, asyncHandler(controller.getGivenTestimonial.bind(controller)));
testMonialRouter.get("/received", authenticate, asyncHandler(controller.getReceivedTestimonial.bind(controller)));
testMonialRouter.get("/requests", authenticate, asyncHandler(controller.getAllTestimonialRequests.bind(controller)));
testMonialRouter.get("/count", authenticate, asyncHandler(controller.getAllTheTestimonialCount.bind(controller)));

export default testMonialRouter;
