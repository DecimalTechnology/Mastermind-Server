import { NextFunction ,Request,Response} from "express";
import { ProfileService } from "./profileService";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import { EmptyRequestBodyError, NotFoundError } from "../../../../../constants/customErrors";

const { OK ,CREATED} = STATUS_CODES;
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    // @desc   Update profile details
    // @route  PUT v1/profile  
    // @access User 
    async updateProfile(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            
             if (!req.body || Object.keys(req.body).length == 0) throw new EmptyRequestBodyError();
              const result =  await this.profileService.updateProfile(req.body,req.userId);
              res.status(OK).json({success:true,message:"Profile datas succesfully updated",data:result}); 
        } catch (error) {
            next(error);
        }
    }

    // @desc   Get all the profile info
    // @route  GET v1/profile  
    // @access User
    async getProfile(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            
            const response = await this.profileService.getProfile(req.userId);
            res.status(OK).json({success:true,message:'User profile fetched successfully',data:response})
        } catch (error) {
            next(error);
        }
    }
    // @desc   Update profile image
    // @route  PATCH v1/profile/profile-picture  
    // @access User
    async updateProfilePicture(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            
            const response = await this.profileService.updateProfilePicture(req.userId,req.files);
            res.status(OK).json({success:true,message:'Profile picture updated successfully',data:response})
        } catch (error) {
            next(error);
        }
    }
    // @desc   Search profile by query
    // @route  GET v1/profile/search  
    // @access User
    async searchProfile(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            if(!req.query.search) throw new NotFoundError("Search query not provided")
            const response = await this.profileService.searchProfile(req.query?.search as string,req.userId as string);
            res.status(OK).json({success:true,message:"",data:response})
        } catch (error) {
            next(error);
        } 
    }
    // @desc   Get profile by profile _id
    // @route  GET v1/profile/:id  
    // @access User
    async getProfileById(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            
            if(!req.params.id) throw new NotFoundError("Invalid user Id")
            const response = await this.profileService.getProfileById(req.params.id as string,req.userId as string);
            res.status(OK).json({success:true,message:"",data:response})
        } catch (error) {
            next(error);
        }
    }
    // @desc   Connect users
    // @route  POST v1/profile/connect  
    // @access User
    async connectUser(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            
            if(!req.query.userId) throw new NotFoundError("Invalid user ID")
            const response = await this.profileService.connectUser(req.userId as string,req.query.userId as string);
            res.status(OK).json({success:true,message:"Connected successfully",data:response})
        } catch (error) {
            next(error);
        }
    }
    // @desc   Get all connection
    // @route  GET v1/profile/connect/all  
    // @access User
    async getConnections(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            
           
            const response = await this.profileService.getConnections(req.userId as string);
            res.status(OK).json({success:true,message:"",data:response})
        } catch (error) {
            next(error);
        }
    }
    // @desc   Accept connection
    // @route  PATCH v1/profile/connect/accept  
    // @access User
    async acceptConnection(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            
            if(!req.body.userId) throw new NotFoundError("Invalid user ID")
            const response = await this.profileService.acceptConnection(req.userId as string,req.body.userId as string);
            res.status(OK).json({success:true,message:"Connection request accepted successfully",data:response})
        } catch (error) {
            next(error);
        }
    }
    // @desc   Remove connection
    // @route  PATCH v1/profile/connect/remove  
    // @access User
    async removeConnection(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            
            if(!req.body.userId) throw new NotFoundError("Invalid user ID")
            const response = await this.profileService.removeConnection(req.userId as string,req.body.userId as string);
            res.status(OK).json({success:true,message:"Connection request removed successfully",data:response})
        } catch (error) {
            next(error);
        }
    }
    // @desc   Cancel cancelConnection connection
    // @route  PATCH v1/profile/connect/cancel  
    // @access User
    async cancelConnection(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            if(!req.body.userId) throw new NotFoundError("Invalid user ID")
            const response = await this.profileService.cancelConnection(req.userId as string,req.body.userId as string);
            res.status(OK).json({success:true,message:"Connection request cancelled successfully ",data:response})
        } catch (error) {
            next(error);
        }
    }
    // @desc   Get all the list of sent requests
    // @route  GET v1/profile/connect/sent  
    // @access User
    async getSendRequests(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            
            const response = await this.profileService.getSendRequests(req.userId as string);
            res.status(OK).json({success:true,message:" ",data:response})
        } catch (error) {
            next(error);
        }
    }
    // @desc   Get the list of receive requests
    // @route  GET v1/profile/connect/received  
    // @access User
    async getReceiveRequests(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            
            const response = await this.profileService.getReceiveRequests(req.userId as string);
            res.status(OK).json({success:true,message:" ",data:response})
        } catch (error) {
            next(error);
        }
    }
    // @desc   Get all connection for the current user
    // @route  GET v1/profile/connect/connections  
    // @access User
    async getAllConnections(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            
            const response = await this.profileService.getAllConnections(req.userId as string);
            res.status(OK).json({success:true,message:" ",data:response})
        } catch (error) {
            next(error);
        }
    }
}
