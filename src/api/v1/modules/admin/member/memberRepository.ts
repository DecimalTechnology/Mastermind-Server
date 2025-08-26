import { IUser } from "../../../../../interfaces/models/IUser";
import Profile from "../../../../../models/profileModel";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class MemberRepository extends BaseRepository<IUser>{
   constructor(){
    super(User)
   }

async createInitialProfile(data:any):Promise<any>{
   return await Profile.create(data)
}
}