import { BadRequestError } from "../../../../../constants/customErrors";
import { UserRole } from "../../../../../enums/common";
import { IRegion } from "../../../../../interfaces/models/IRegion";
import { RegionRepository } from "./regionRepository";

export class RegionServices {
    constructor(private regionRepository: RegionRepository) {}

    async searchUsers(search: string) {
        return await this.regionRepository.findAllUser(search);
    }

    // Create region
    async createRegion(data: { name: string; nationId: string }, adminId: string, createdBy: string): Promise<any> {
        const newRegionData = { ...data, createdBy };
        const isAlreadyExists = await this.regionRepository.findByName(data?.name);
      
        if(isAlreadyExists){
            throw new BadRequestError("The region name already exists")
        }
        const res = await this.regionRepository.create(newRegionData);
        const populatedResult: any = await this.regionRepository.findRegionById(res?._id);
        const newAdminObj = {
            role: UserRole.REGIONAL_ADMIN,
            manage: {
                region: res?._id,
            },
        };
        await this.regionRepository.updateAdminData(adminId, newAdminObj);
        return populatedResult[0];
    }

    // Find all regions
    async getAllRegions(search: string): Promise<any> {
        return await this.regionRepository.findAllRegions(search);
    }
    // Find all regions
    async findRegionById(id:string): Promise<any> {
        return await this.regionRepository.findById(id)
    }
}
