import { IUser } from "../../../../../interfaces/models/IUser";
import User from "../../../../../models/userModel";
import { BaseRepository } from "./baseRepository";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }

 
}
