import { ConflictError } from "../../../../../constants/customErrors";
import { UserRole } from "../../../../../enums/common";
import { IUser } from "../../../../../interfaces/models/IUser";
import { ReportRepository } from "../../shared/repositories/reportRepository";
import { UserRepository } from "../../shared/repositories/userRepository";
import { LocalRepository } from "./localRepository";
import User from "../../../../../models/userModel";

export class LocalServices {
    constructor(private localRepository: LocalRepository, private userResository: UserRepository,private reportRepository:ReportRepository) {}

    async getAllUsers(search: string): Promise<IUser[]> {
        return await this.localRepository.findAllUsersBySerachQuery(search as string);
    }

    async getAllLocals(search: string, regionId: string): Promise<any> {
        const res  = await this.localRepository.findAllLocals(search as string, regionId);
        return res;
       
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
    async findAllReports(adminId: string,query:any): Promise<any> {
        return await this.reportRepository.findAllReportsForLocalAdmin(adminId as string,query);
    }
    async getLocalDetails(adminId: string): Promise<any> {
        return await this.localRepository.findLocalDetails(adminId as string);
    }

    async getCoreTeamByChapter(chapterId: string): Promise<any[]> {
        return await this.localRepository.getCoreTeamByChapter(chapterId);
    }

    async searchChapterMembers(chapterId: string, search: string): Promise<any[]> {
        return await this.localRepository.searchChapterMembers(chapterId, search);
    }

    async updateCoreTeamRole(userId: string, isAdd: boolean, chapterId?: string): Promise<any> {
        return await this.localRepository.updateCoreTeamRole(userId, isAdd, chapterId);
    }

    async updateLocal(id: string, data: any, adminId?: string): Promise<any> {
        await this.localRepository.findByIdAndUpdate(id, data);
        if (adminId) {
            await User.updateMany({ "manage.local": id }, { $set: { role: UserRole.MEMBER, "manage.local": null } });
            await this.userResository.findByIdAndUpdate(adminId, { role: UserRole.LOCAL_ADMIN, manage: { local: id } });
        }
        const localData: any = await this.localRepository.findLocalData(id);
        return localData[0];
    }

    async deleteLocal(id: string): Promise<any> {
        await User.updateMany({ "manage.local": id }, { $set: { role: UserRole.MEMBER, "manage.local": null } });
        return await this.localRepository.findByIdAndDelete(id);
    }
}
