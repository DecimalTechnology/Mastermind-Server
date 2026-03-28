import express from 'express'
import { adminAuth } from '../../../../../middewares.ts/authenticateAdmin';
import upload from '../../../../../middewares.ts/upload';
import { DiscountRepository } from './discountRepository';
import { DiscountService } from './discountService';
import { DiscountController } from './discountController';
import uploadMediaS3 from '../../../../../utils/v1/s3/image/uploadImageS3';
import roleAuth from '../../../../../middewares.ts/roleAuth';
import { UserRole } from '../../../../../enums/common';

const discountRouter = express.Router();

const discountRepository  = new DiscountRepository();
const discountService = new DiscountService(discountRepository);
const controller = new DiscountController(discountService);
const allowedRoles = [UserRole.SUPER_ADMIN,UserRole.REGIONAL_ADMIN,UserRole.LOCAL_ADMIN,UserRole.NATIONAL_ADMIN]
discountRouter.post("/",adminAuth,  uploadMediaS3.fields([{ name: "image" }]),controller.createDiscount);
discountRouter.get("/",adminAuth,roleAuth(...allowedRoles),controller.getAllDiscountCards);
discountRouter.put("/:cardId",adminAuth,uploadMediaS3.fields([{ name: "image" }]),roleAuth(...allowedRoles),controller.editDiscountCard);
discountRouter.delete("/:cardId",adminAuth,roleAuth(...allowedRoles),controller.deleteDiscountCard);


export default discountRouter;