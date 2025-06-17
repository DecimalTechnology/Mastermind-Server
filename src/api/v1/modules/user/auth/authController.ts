import { NextFunction, Request, Response } from "express-serve-static-core";
import { AuthService } from "./authService";
import { EmptyRequestBodyError, NotFoundError } from "../../../../../constants/customErrors";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
const { OK, CREATED } = STATUS_CODES;
export class AuthController {
    constructor(private authService: AuthService) { }

    // @desc   New User Registration pwa
    // @route  POST v1/auth/register  
    // @access User 
    async registration(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
     
            // userValidationSchema.parse(req.body)
            const response = await this.authService.userRegistration(req.body);
            res.status(OK).json({ success: true, message: "User registration successfull", data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   New User login pwa
    // @route  POST v1/auth/signin  
    // @access User 
    async userLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.body || Object.keys(req.body).length == 0) throw new EmptyRequestBodyError();
            const response = await this.authService.userLogin(req.body);
            res.status(OK).json({ success: true, message: "User signin successfull", data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   Reset password  
    // @route  POST v1/auth/password/reset   
    // @access User 
    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.body || Object.keys(req.body).length == 0) throw new EmptyRequestBodyError();
            const response = await this.authService.resetPassword(req.body.oldPassword, req.body.newPassword, req.userId as string);
            res.status(OK).json({ success: true, message: "Your password has been successfully reset", data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   Forget password
    // @route  POST v1/auth/password/forget  
    // @access User 
    async forgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.body || Object.keys(req.body).length == 0) throw new EmptyRequestBodyError();
            const response = await this.authService.forgetPassword(req.body.email as string, req.body.otp as string);
            res.status(OK).json({ success: true, message: "One time password has been sent to your email", data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   Updated new password while forgetting
    // @route  POST v1/auth/password/forget  
    // @access User 
    async updateForgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.body || Object.keys(req.body).length == 0) throw new EmptyRequestBodyError();
            const response = await this.authService.updateForgetPassword(req.body.email as string, req.body.password as string);
            res.status(OK).json({ success: true, message: "Your password has been updated successfully", data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   To get all the nation list
    // @route  POST v1/auth/nations
    // @access User 
    async getAllNations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            
            const response = await this.authService.getAllNations()
            res.status(OK).json({ success: true, message: "", data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   To get all the regions list
    // @route  POST v1/auth/regions
    // @access User 
    async getAllRegions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const nationId = req.query?.nationId;
            if(!nationId) throw new NotFoundError("Please provide region Id")
            const response = await this.authService.getAllRegions(nationId as string);
            res.status(OK).json({ success: true, message: "", data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   To get all the locals list
    // @route  POST v1/auth/locals
    // @access User 
    async getAllLocals(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const regionId = req.query?.regionId;
            if(!regionId) throw new NotFoundError("Please provide regionId Id")
            const response = await this.authService.getAllLocalsByRegionId(regionId as string);
            res.status(OK).json({ success: true, message: "", data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   To get all the chapters list
    // @route  POST v1/auth/chapters
    // @access User 
    async getAllChapters(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const localId = req.query?.localId;
            if(!localId) throw new NotFoundError("Please provide local Id")
            const response = await this.authService.getAllChaptersByLocalId(localId as string);
            res.status(OK).json({ success: true, message: "", data: response });
        } catch (error) {
            next(error);
        }
    }

}
