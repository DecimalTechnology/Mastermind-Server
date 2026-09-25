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
import User from "../../../../../models/userModel";


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

    // Update nation
    async updateNation(id: string, data: { name?: string }, adminId?: string): Promise<any> {
        if (data.name) {
            const isAlreadyExists: any = await this.nationRepository.findByName(data.name);
            if (isAlreadyExists && isAlreadyExists._id.toString() !== id) {
                throw new ConflictError("The name you provided is already assigned to another nation");
            }
        }
        await this.nationRepository.findByIdAndUpdate(id, data);
        if (adminId) {
            const adminData = await this.userRepository.findById(adminId);
            if (!adminData) throw new NotFoundError("Admin not found");
            if (adminData.role !== "member" && adminData.role !== "national_admin") {
                throw new BadRequestError(`Not able to assign multiple roles. He is already a ${adminData.role}`);
            }
            await this.nationRepository.updateNationAdmin(id, adminId);
        }
        const populatedResult: any = await this.nationRepository.findNation(id);
        return populatedResult ? populatedResult[0] : null;
    }

    // Delete nation
    async deleteNation(id: string): Promise<any> {
        return await this.nationRepository.deleteNation(id);
    }

    // Get nation details (with regions and members)
    async getNationDetails(nationId: string): Promise<any> {
        const nationData = await this.nationRepository.findNation(nationId);
        if (!nationData || nationData.length === 0) {
            throw new NotFoundError("Nation not found");
        }

        // Get regions in this nation
        const regions = await Region.find({ nationId }).populate("createdBy").lean();

        // Get members in this nation hierarchy
        const regionIds = regions.map(r => r._id);
        const locals = await Local.find({ regionId: { $in: regionIds } }).lean();
        const localIds = locals.map(l => l._id);
        const chapters = await Chapter.find({ localId: { $in: localIds } }).lean();
        const chapterIds = chapters.map(c => c._id);
        const members = await User.find({ chapter: { $in: chapterIds } })
            .populate({
                path: "chapter",
                select: "name _id localId",
                populate: { path: "localId", select: "name _id" }
            })
            .lean();

        // Map members to include local
        const membersWithLocal = members.map((m: any) => {
            const localObj = m.chapter?.localId;
            return {
                ...m,
                local: localObj ? { _id: localObj._id, name: localObj.name } : null
            };
        });

        return {
            nation: nationData[0],
            regions,
            members: membersWithLocal
        };
    }
}

