import { UserRole } from "../../../../../enums/common";
import { INation } from "../../../../../interfaces/models/INation";
import { IUser } from "../../../../../interfaces/models/IUser";

import { UserRepository } from "../../shared/repositories/userRepository";
import { NationRepository } from "./repository";


export class NationServices {
    constructor(
       
        private nationRepository: NationRepository,
        private userRepository: UserRepository
    ) {}

    // Search users
    async searchUsers(search: string): Promise<IUser[]> {
        return await this.nationRepository.findAllUser(search);
    }

    // Create nation
    async createNation(data: { name: string; admin: string }, adminId: string): Promise<any> {
        const nationObj = {
            name: data?.name,
            createdBy: adminId,
        };

        const res = await this.nationRepository.create(nationObj);
        const userUpdateObj = {
            manage:{
                 nation: res?._id
            },
            role:UserRole.NATIONAL_ADMIN
        }
        return await this.userRepository.findByIdAndUpdate(data?.admin,userUpdateObj);
    }

    // Find all nations
    async searchNations(search:string):Promise<INation[]|[]>{
        return await this.nationRepository.searchBySearchQuery(search)
    }
}
