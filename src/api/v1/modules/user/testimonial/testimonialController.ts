import { TestimonialService } from "./testimonialService";
import { NextFunction, Request, Response } from "express";
import { chapterSchema } from "../../../../../validations/admin/chapter";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import { NotFoundError } from "../../../../../constants/customErrors";
const { OK } = STATUS_CODES;
export class TestimonialController{
    constructor (private testimonialService:TestimonialService){

    }

    // @desc   Create 
    // @route  POST v1/admin/chapter
    // @access Super_admin, National_admin, Regional_admin, Local_admin
   

}