import { ITips } from "../../../../../models/tipsModel";
import { TipsRepository } from "./tipsRepository";

export class TipsService{
    constructor(private tipsRepository:TipsRepository){
        
    }

    async createTips(data:ITips):Promise<ITips|null>{
      
         return await this.tipsRepository.create(data)
    }
}