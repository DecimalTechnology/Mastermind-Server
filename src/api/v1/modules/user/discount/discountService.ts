import { IDiscount } from "../../../../../models/discountModel";
import { DiscountRepository } from "./discountRepostiory";


export class DiscountService{
    constructor(private discountRepository: DiscountRepository){

    }

    async getAllDiscountCards(query:any):Promise<IDiscount[]>{
       return await this.discountRepository.getAllDiscountCards(query)
    }
}