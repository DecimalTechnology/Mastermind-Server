import { IUser } from "../../../../../interfaces/models/IUser";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class MemberRepository extends BaseRepository<IUser>{
   constructor(){
    super(User)
   }
}