import discountModel, { IDiscount } from "../../../../../models/discountModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class DiscountRepository extends BaseRepository<IDiscount>  {
constructor(){
    super(discountModel)
}
}