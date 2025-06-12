import { UserRole } from "../../../../../enums/common";
import { INation } from "../../../../../interfaces/models/INation";
import { IUser } from "../../../../../interfaces/models/IUser";
import { NationRepository } from "../../shared/repositories/nationRepository";
import { UserRepository } from "../../shared/repositories/userRepository";
import { SuperAdminRepository } from "./repository";

export class SuperAdminService {
    constructor(
        private superAdminRepository: SuperAdminRepository,
        private nationRepository: NationRepository,
        private userRepository: UserRepository
    ) {}

    // Search users
    async searchUsers(search: string): Promise<IUser[]> {
        return await this.superAdminRepository.findAllUser(search);
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
        return await this.superAdminRepository.searchBySearchQuery(search)
    }
}
