import { ITycb } from "../../../../../interfaces/models/ITycb";
import { TYCBRepository } from "./TYCBRepository";

export class TYCBServices {
    constructor(private tycbRepository: TYCBRepository) {}

    async createTycb(data:ITycb): Promise<ITycb> {
        return await this.tycbRepository.create(data)
    }

    async getAllTycb(userId:string):Promise<ITycb[]>{
        return await this.tycbRepository.getAllTycb(userId)
    }
    async getAllSentTycb(userId:string):Promise<ITycb[]>{
        return await this.tycbRepository.getAllSentTycb(userId)
    }
}
