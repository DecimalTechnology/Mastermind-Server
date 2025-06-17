import { ConflictError } from "../../../../../constants/customErrors";
import { UserRole } from "../../../../../enums/common";
import { IUser } from "../../../../../interfaces/models/IUser";
import { UserRepository } from "../../shared/repositories/userRepository";
import { LocalRepository } from "./localRepository";

export class LocalServices {
    constructor(private localRepository: LocalRepository, private userResository: UserRepository) {}

    async getAllUsers(search: string): Promise<IUser[]> {
        return await this.localRepository.findAllUsersBySerachQuery(search as string);
    }

    async getAllLocals(search: string, regionId: string): Promise<any> {
        return await this.localRepository.findAllLocals(search as string, regionId);
    }

    async createLocal(data: any, adminId: string, createdBy: string): Promise<any> {
        const isAlreadyExists = await this.localRepository.findByName(data?.name);
        if (isAlreadyExists) throw new ConflictError("Name conflict. Local area name already exists");

        const res = await this.localRepository.create({ ...data, createdBy });
        await this.userResository.findByIdAndUpdate(adminId, { role: UserRole.LOCAL_ADMIN, manage: { local: res?._id } });

        const localData: any = await this.localRepository.findLocalData(res?._id as string);
        return localData[0];
    }

    async findLocalById(chapterId: string): Promise<any> {
        return await this.localRepository.findById(chapterId as string);
    }
}
