import { NextFunction ,Request,Response} from "express";
import { DiscountService } from "./discountService";

export class DiscountController{
    constructor(private discountService: DiscountService){

    }

    getAllDiscounts = async (req: Request, res: Response,next:NextFunction) => {
     try{
        
     const result = await this.discountService.getAllDiscountCards(req.query);
     res.status(200).json({success: true, data: result})
     }catch(error){
        next(error)
     }
    }
}