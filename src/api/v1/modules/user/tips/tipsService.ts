import { ITips } from "../../../../../models/tipsModel";
import { TipsRepository } from "./tipsRepository";

export class TipsService {
    constructor(private tipsRepository:TipsRepository){

    }

    async getTodayTip():Promise<ITips[]>{
        return await this.tipsRepository.findTodaysTip()
    }
}