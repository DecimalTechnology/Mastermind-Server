import { IRegion } from "../../../../../interfaces/models/IRegion";
import { IUser } from "../../../../../interfaces/models/IUser";
import { Region } from "../../../../../models/regionModel";
import { Local } from "../../../../../models/localModel";
import { Chapter } from "../../../../../models/chapterModal";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class RegionRepository extends BaseRepository<any> {
    constructor() {
        super(Region);
    }

    async findAllUser(search: string): Promise<IUser[]> {
        return await User.aggregate([
            {
                $match: {
                    name: { $regex: search, $options: "i" },
                    role: "member",
                },
            },
        ]);
    }

    async updateAdminData(adminId: string, adminData: any): Promise<IUser | null> {
        return await User.findByIdAndUpdate(adminId, adminData);
    }
    async findRegionById(regionId: string): Promise<IRegion[] | null> {
        return await Region.aggregate([
            { $match: { _id: regionId } },
            { $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "createdBy" } },
            { $lookup: { from: "nations", localField: "nationId", foreignField: "_id", as: "nationData" } },
            { $lookup: { from: "users", localField: "_id", foreignField: "manage.region", as: "adminData" } },
        ])
    }

    async findAllRegions(search: string): Promise<IRegion[]> {
        return await Region.aggregate([
            { $match: { name: { $regex: search, $options: "i" } } },
            { $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "createdBy" } },
            { $lookup: { from: "nations", localField: "nationId", foreignField: "_id", as: "nationData" } },
            { $lookup: { from: "users", localField: "_id", foreignField: "manage.region", as: "adminData" } },
        ]);
    }

    async findAllRegionsByNationId(nationId: string): Promise<IRegion[]> {
        return await Region.find({ nationId: nationId });
    }

    async findAdminById(adminId: string): Promise<any> {
        return await User.findById(adminId);
    }

    async findMembersByRegion(regionId: string): Promise<any[]> {
        const locals = await Local.find({ regionId });
        const localIds = locals.map(l => l._id);
        const chapters = await Chapter.find({ localId: { $in: localIds } });
        const chapterIds = chapters.map(c => c._id);
        const members = await User.find({ chapter: { $in: chapterIds } })
            .populate({
                path: "chapter",
                select: "name _id localId",
                populate: { path: "localId", select: "name _id" }
            })
            .lean();

        return members.map((m: any) => {
            const localObj = m.chapter?.localId;
            return {
                ...m,
                local: localObj ? { _id: localObj._id, name: localObj.name } : null
            };
        });
    }

    async findLocalsByRegion(regionId: string): Promise<any[]> {
        return await Local.find({ regionId: regionId }).select("name _id").lean();
    }

    async findAdminsByRegion(regionId: string): Promise<any> {
        const regionalAdmins = await User.find({
            role: "regional_admin",
            "manage.region": regionId
        }).populate({ path: "manage.region", model: "Region", select: "name" }).lean();

        return {
            regionalAdmins
        };
    }
}
