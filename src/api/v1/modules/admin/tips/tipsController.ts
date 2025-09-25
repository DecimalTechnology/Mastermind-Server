import { NextFunction, Request, Response } from "express";
import { TipsService } from "./tipsService";
import { uploadImagesToS3 } from "../../../../../utils/v1/s3/image/uploadImagesToS3";
import { uploadVideosToS3 } from "../../../../../utils/v1/s3/image/uploadVideosToS3";
import { BodyValidator } from "../../../../../constants/customErrors";
import { createTipsValidator } from "../../../../../validations/joi/tipsValidator";
import { STATUS_CODES } from "../../../../../constants/statusCodes";

export class TipsContoller {
    constructor(private tipsService: TipsService) {}

    createTips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.adminId;
           
            req.body.userId = userId;
            BodyValidator(createTipsValidator, req.body);

            const imageFiles = (req.files as any)?.filter((file: Express.Multer.File) => file.fieldname == "images");
            const videoFiles = (req.files as any)?.filter((file: Express.Multer.File) => file.fieldname == "videos");
            const images = await uploadImagesToS3(imageFiles);
            const videos = await uploadVideosToS3(videoFiles);
            req.body.images = images||[];
            req.body.videos = videos||[];
            const result = await this.tipsService.createTips(req.body);
            res.status(STATUS_CODES.CREATED).json({success:true,message:"New tips successfully created",data:result})
        } catch (error) {
            next(error);
        }
    };
}
