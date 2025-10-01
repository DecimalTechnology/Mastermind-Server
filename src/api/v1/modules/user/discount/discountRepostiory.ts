import discountModel, { IDiscount } from "../../../../../models/discountModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

    export class DiscountRepository extends BaseRepository<IDiscount> {
        constructor() {
            super(discountModel)
        }

        async getAllDiscountCards(query:any): Promise<IDiscount[]> {
            return await discountModel.find(query)
        }
    }