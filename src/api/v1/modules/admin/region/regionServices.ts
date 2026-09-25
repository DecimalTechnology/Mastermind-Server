import { BadRequestError } from "../../../../../constants/customErrors";
import { UserRole } from "../../../../../enums/common";
import { IRegion } from "../../../../../interfaces/models/IRegion";
import { RegionRepository } from "./regionRepository";
import mongoose from "mongoose";

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
    async getAllRegions(search: string, adminId?: string, role?: string, queryNationId?: string): Promise<any> {
        let nationId: string | undefined = queryNationId;
        if (role === UserRole.NATIONAL_ADMIN && adminId) {
            const admin = await this.regionRepository.findAdminById(adminId);
            if (admin && admin.manage?.nation) {
                nationId = admin.manage.nation.toString();
            }
        }
        return await this.regionRepository.findAllRegions(search, nationId);
    }
    // Find all regions
    async findRegionById(id:string): Promise<any> {
        return await this.regionRepository.findById(id)
    }

    async getMembersByAdmin(adminId: string, queryRegionId?: string): Promise<any> {
        let regionId: string;
        if (queryRegionId) {
            regionId = queryRegionId;
        } else {
            const admin = await this.regionRepository.findAdminById(adminId);
            if (!admin || !admin.manage?.region) {
                throw new BadRequestError("Region admin has no managed region assigned");
            }
            regionId = admin.manage.region.toString();
        }
        const members = await this.regionRepository.findMembersByRegion(regionId);
        const locals = await this.regionRepository.findLocalsByRegion(regionId);
        return { members, locals };
    }

    async getRegionDetails(adminId: string, queryRegionId?: string): Promise<any> {
        let regionId: string;
        if (queryRegionId) {
            regionId = queryRegionId;
        } else {
            const admin = await this.regionRepository.findAdminById(adminId);
            if (!admin || !admin.manage?.region) {
                throw new BadRequestError("Region admin has no managed region assigned");
            }
            regionId = admin.manage.region.toString();
        }
        const regionData = await this.regionRepository.findRegionById(regionId);
        const locals = await this.regionRepository.findLocalsByRegion(regionId);
        const members = await this.regionRepository.findMembersByRegion(regionId);
        
        const Chapter = mongoose.model("Chapter");
        const localIds = locals.map(l => l._id);
        const chapters = await Chapter.find({ localId: { $in: localIds } }).populate("createdBy").lean();

        return {
            region: regionData ? regionData[0] : null,
            locals,
            chapters,
            members
        };
    }

    async getLocalDetailsById(localId: string): Promise<any> {
        const Local = mongoose.model("Local");
        const Chapter = mongoose.model("Chapter");
        const User = mongoose.model("User");
        const Event = mongoose.model("Event");

        const local = await Local.findById(localId).populate("nationId").populate("regionId").populate("createdBy");
        const chapters = await Chapter.find({ localId }).populate("createdBy");
        const chapterIds = chapters.map(c => c._id);

        const members = await User.find({
            $and: [
                {
                    $or: [
                        { chapter: { $in: chapterIds } },
                        { "manage.chapter": { $in: chapterIds } }
                    ]
                },
                { role: { $in: ["member", "core_team_admin", "chapter_admin"] } }
            ]
        }).populate("chapter");

        const events = await Event.find({ chapterId: { $in: chapterIds } }).populate("chapterId");
        const localEvents = await Event.find({ localId, eventType: "local" });

        return {
            local,
            chapters,
            members,
            events,
            localEvents
        };
    }

    async getRegionAdmins(adminId: string, queryRegionId?: string): Promise<any> {
        let regionId: string;
        if (queryRegionId) {
            regionId = queryRegionId;
        } else {
            const admin = await this.regionRepository.findAdminById(adminId);
            if (!admin || !admin.manage?.region) {
                throw new BadRequestError("Region admin has no managed region assigned");
            }
            regionId = admin.manage.region.toString();
        }
        return await this.regionRepository.findAdminsByRegion(regionId);
    }

    async updateRegion(id: string, data: { name?: string }, adminId?: string): Promise<any> {
        if (data.name) {
            const isAlreadyExists: any = await this.regionRepository.findByName(data.name);
            if (isAlreadyExists && isAlreadyExists._id.toString() !== id) {
                throw new BadRequestError("The region name already exists");
            }
        }
        await this.regionRepository.findByIdAndUpdate(id, data);
        if (adminId) {
            await this.regionRepository.updateRegionAdmin(id, adminId);
        }
        const populatedResult: any = await this.regionRepository.findRegionById(id);
        return populatedResult ? populatedResult[0] : null;
    }

    async deleteRegion(id: string): Promise<any> {
        return await this.regionRepository.deleteRegion(id);
    }
}
