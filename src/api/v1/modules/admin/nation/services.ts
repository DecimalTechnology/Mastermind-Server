import { BadRequestError, ConflictError, NotFoundError } from "../../../../../constants/customErrors";
import { UserRole } from "../../../../../enums/common";
import { INation } from "../../../../../interfaces/models/INation";
import { IUser } from "../../../../../interfaces/models/IUser";

import { UserRepository } from "../../shared/repositories/userRepository";
import { NationRepository } from "./repository";

export class NationServices {
    constructor(private nationRepository: NationRepository, private userRepository: UserRepository) {}

    // Search users
    async searchUsers(search: string): Promise<IUser[]> {
        return await this.nationRepository.findAllUser(search);
    }

    // Create nation
    async createNation(data: { name: string; admin: string }, adminId: string, createdBy: string): Promise<any> {
        const nationObj = {
            name: data?.name,
            createdBy: createdBy,
        };

        const adminData = await this.userRepository.findById(adminId);
        if (!adminId) throw new NotFoundError("Admin not found");
        if (adminData?.role !== "member") throw new BadRequestError(`Not able to assign multiple roles. He is already a ${adminData?.role}`);
        const isNameAlreadyExists = await this.nationRepository.findByName(data?.name);
        if (isNameAlreadyExists) throw new ConflictError("The name your provided is already assigned to other nation");
        const res = await this.nationRepository.create(nationObj);
        const userUpdateObj = {
            manage: {
                nation: res?._id,
            },
            role: UserRole.NATIONAL_ADMIN,
        };
        await this.userRepository.findByIdAndUpdate(adminId, userUpdateObj);
        const result: any = await this.nationRepository.findNation(res?._id);

        return result[0];
    }

    // Find all nations
    async searchNations(search: string): Promise<INation[] | []> {
        return await this.nationRepository.searchBySearchQuery(search);
    }
}
