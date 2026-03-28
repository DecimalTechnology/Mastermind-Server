import { NextFunction, Request, Response } from "express";
import { DiscountService } from "./discountService";
import { BadRequestError, BodyValidator } from "../../../../../constants/customErrors";
import { discountValidator } from "../../../../../validations/joi/disountValidator";
import { uploadImagesToS3 } from "../../../../../utils/v1/s3/image/uploadImagesToS3";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import mongoose from "mongoose";

export class DiscountController {
    constructor(private discountService: DiscountService) {}
    createDiscount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            BodyValidator(discountValidator, req.body);

            // const loca = (req);

            // console.log(loca);
            // const imageFile = req.file;
            // const images = await uploadImagesToS3([imageFile] as any);

            const images = (req.files as any)?.image.map((obj: any) => obj?.location);
            req.body.image = images[0];
            const result = await this.discountService.createDiscount(req.body);
            res.status(STATUS_CODES.CREATED).json({ success: true, message: "New discount successfully created", data: result });
        } catch (error) {
            next(error);
        }
    };
    getAllDiscountCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.discountService.getAllDiscountCards();
            res.status(STATUS_CODES.OK).json({ success: true, message: "New discount successfully created", data: result });
        } catch (error) {
            next(error);
        }
    };

    editDiscountCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const cardId = req.params.cardId;

            if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) throw new BadRequestError("Card id is required");

            const images = Object.keys(req.files as any).length > 0 ? (req.files as any)?.image.map((obj: any) => obj?.location) : [];
            const image = images[0];

            const result = await this.discountService.updateDiscountCard(cardId, req.body, image);
            res.status(STATUS_CODES.OK).json({ success: true, message: "New discount successfully updated", data: result });
        } catch (error) {
            next(error);
        }
    };

    deleteDiscountCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const cardId = req.params.cardId;

            if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) throw new BadRequestError("Card id is required");

           
            const result = await this.discountService.deleteDiscountCard(cardId);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Discountcard successfully deleted", data: result });
        } catch (error) {
            next(error);
        }
    };
}
