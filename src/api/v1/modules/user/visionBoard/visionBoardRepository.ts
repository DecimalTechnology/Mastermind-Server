import visionBoardModel from "../../../../../models/visionBoardModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class VisionBoardRepository extends BaseRepository<any>{
    constructor(){
        super(visionBoardModel)
    }

    async findByUserId(userId:string,year:number):Promise<any>{
        return await visionBoardModel.findOne({userId:userId,year:year})
    }
}