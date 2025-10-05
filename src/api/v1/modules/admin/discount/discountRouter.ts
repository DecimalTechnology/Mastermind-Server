import express from 'express'
import { adminAuth } from '../../../../../middewares.ts/authenticateAdmin';
import upload from '../../../../../middewares.ts/upload';
import { DiscountRepository } from './discountRepository';
import { DiscountService } from './discountService';
import { DiscountController } from './discountController';
import uploadMediaS3 from '../../../../../utils/v1/s3/image/uploadImageS3';

const discountRouter = express.Router();

const discountRepository  = new DiscountRepository();
const discountService = new DiscountService(discountRepository);
const controller = new DiscountController(discountService);

discountRouter.post("/",adminAuth,  uploadMediaS3.fields([{ name: "image" }]),controller.createDiscount);


export default discountRouter;