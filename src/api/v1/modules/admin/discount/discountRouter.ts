import express from 'express'
import { adminAuth } from '../../../../../middewares.ts/authenticateAdmin';
import upload from '../../../../../middewares.ts/upload';
import { DiscountRepository } from './discountRepository';
import { DiscountService } from './discountService';
import { DiscountController } from './discountController';

const discountRouter = express.Router();

const discountRepository  = new DiscountRepository();
const discountService = new DiscountService(discountRepository);
const controller = new DiscountController(discountService);

discountRouter.post("/",adminAuth,upload.single('image'),controller.createDiscount);


export default discountRouter;