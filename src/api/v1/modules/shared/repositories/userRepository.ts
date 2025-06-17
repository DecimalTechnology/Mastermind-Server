import { Types } from "mongoose";
import { IUser } from "../../../../../interfaces/models/IUser";
import User from "../../../../../models/userModel";
import { BaseRepository } from "./baseRepository";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }

    async updateCoreTeamData(coreTeams:any,data:any):Promise<any>{
        const objectIds = coreTeams.map((ids:any)=>new Types.ObjectId(ids));
        return await User.updateMany({_id:{$in:objectIds}},{$set:data})
    }

 
}
