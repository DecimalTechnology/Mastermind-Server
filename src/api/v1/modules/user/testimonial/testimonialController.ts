import { TestimonialService } from "./testimonialService";
import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
const { OK } = STATUS_CODES;
export class TestimonialController {
    constructor(private testimonialService: TestimonialService) {}

    // @desc   Create
    // @route  POST v1/testimonial/give/:id
    // @access User
    async createTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.userId;
        const toUser = req.params.id;
        const message = req.body.message;
        const testimonialObject = {
            fromUser: userId,
            toUser,
            message,
        };
        const result = await this.testimonialService.createTestimonial(testimonialObject );
        res.status(OK).json({ success: true, message: "Thank you! Your testimonial has been submitted successfully.", data: result });
    }
    // @desc   Create
    // @route  POST v1/testimonial/ask/:id
    // @access User
    async createAskTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log(req.body)
        const userId = req.userId;
        const toUser = req.params.id;
        const message = req.body.message;
        const testimonialObject = {
            fromUser: userId,
            toUser,
            message,
        };
        const result = await this.testimonialService.createAskTestimonial(testimonialObject );
        res.status(OK).json({ success: true, message: "Testimonial request sent successfully", data: result });
    }
    // @desc   Get all the given testimonial
    // @route  POST v1/testimonial/given/:id
    // @access User
    async getGivenTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
        
       
        const result = await this.testimonialService.getAllGivenTestimonial(req.userId );
        res.status(OK).json({ success: true, message: "", data: result });
    }
    // @desc   Get all the given testimonial
    // @route  POST v1/testimonial/given/:id
    // @access User
    async getAllTheTestimonialCount(req: Request, res: Response, next: NextFunction): Promise<void> {
        
       
        const result = await this.testimonialService.getAllTestimonialCount(req.userId );
        res.status(OK).json({ success: true, message: "", data: result });
    }
}
