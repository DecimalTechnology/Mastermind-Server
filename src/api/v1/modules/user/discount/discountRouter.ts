import express from 'express';
import { DiscountRepository } from './discountRepostiory';
import { DiscountService } from './discountService';
import { DiscountController } from './discountControlle';
import { authenticate } from '../../../../../middewares.ts/authenticate';

const discountRouter = express.Router();

const discountRepository =  new DiscountRepository();
const discountService = new DiscountService(discountRepository);
const controller = new DiscountController(discountService);

discountRouter.get("/",authenticate,controller.getAllDiscounts)

export default discountRouter;