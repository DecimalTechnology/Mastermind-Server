import { BadRequestError, ConflictError, NotFoundError } from "../../../../../constants/customErrors";
import { UserRole } from "../../../../../enums/common";
import { INation } from "../../../../../interfaces/models/INation";
import { IUser } from "../../../../../interfaces/models/IUser";

import { UserRepository } from "../../shared/repositories/userRepository";
import { NationRepository } from "./repository";
import { Nation } from "../../../../../models/nationModel";
import { Region } from "../../../../../models/regionModel";
import { Local } from "../../../../../models/localModel";
import { Chapter } from "../../../../../models/chapterModal";

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

    // Get community tree
    async getCommunityTree(): Promise<any> {
        const nations = await Nation.find({}).lean();
        const regions = await Region.find({}).lean();
        const locals = await Local.find({}).lean();
        const chapters = await Chapter.find({}).select('name nationId regionId localId').lean();

        // Map regions by nationId
        const regionsByNation: Record<string, any[]> = {};
        regions.forEach(region => {
            const nationId = region.nationId?.toString();
            if (nationId) {
                if (!regionsByNation[nationId]) {
                    regionsByNation[nationId] = [];
                }
                regionsByNation[nationId].push({
                    _id: region._id,
                    name: region.name,
                    isActive: region.isActive,
                    locals: []
                });
            }
        });

        // Map locals by regionId
        const localsByRegion: Record<string, any[]> = {};
        locals.forEach(loc => {
            const regionId = loc.regionId?.toString();
            if (regionId) {
                if (!localsByRegion[regionId]) {
                    localsByRegion[regionId] = [];
                }
                localsByRegion[regionId].push({
                    _id: loc._id,
                    name: loc.name,
                    isActive: loc.isActive,
                    chapters: []
                });
            }
        });

        // Map chapters by localId
        const chaptersByLocal: Record<string, any[]> = {};
        chapters.forEach(chap => {
            const localId = chap.localId?.toString();
            if (localId) {
                if (!chaptersByLocal[localId]) {
                    chaptersByLocal[localId] = [];
                }
                chaptersByLocal[localId].push({
                    _id: chap._id,
                    name: chap.name,
                    isActive: chap.isActive
                });
            }
        });

        // Construct tree
        const tree = nations.map(nation => {
            const nationId = nation._id.toString();
            const nationRegions = regionsByNation[nationId] || [];

            nationRegions.forEach(reg => {
                const regId = reg._id.toString();
                const regionLocals = localsByRegion[regId] || [];

                regionLocals.forEach(loc => {
                    const locId = loc._id.toString();
                    loc.chapters = chaptersByLocal[locId] || [];
                });

                reg.locals = regionLocals;
            });

            return {
                _id: nation._id,
                name: nation.name,
                isActive: nation.isActive,
                regions: nationRegions
            };
        });

        return tree;
    }
}
