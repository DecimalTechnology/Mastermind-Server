import { NextFunction, Request, Response } from "express";
import { DiscountService } from "./discountService";
import { BodyValidator } from "../../../../../constants/customErrors";
import { discountValidator } from "../../../../../validations/joi/disountValidator";
import { uploadImagesToS3 } from "../../../../../utils/v1/s3/image/uploadImagesToS3";
import { STATUS_CODES } from "../../../../../constants/statusCodes";

export class DiscountController {
    constructor(private discountService: DiscountService) {}
    createDiscount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            BodyValidator(discountValidator, req.body);
             console.log(req.files)
            // const loca = (req);

            // console.log(loca);
            // const imageFile = req.file;
            // const images = await uploadImagesToS3([imageFile] as any);
            console.log(req.files)
            const images = (req.files as any)?.image.map((obj: any) => obj?.location);
             req.body.image = images[0];
            const result = await this.discountService.createDiscount(req.body);
            res.status(STATUS_CODES.CREATED).json({ success: true, message: "New discount successfully created", data: result });
        } catch (error) {
            next(error);
        }
    };
}
