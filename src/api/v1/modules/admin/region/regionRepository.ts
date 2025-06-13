import { IRegion } from "../../../../../interfaces/models/IRegion";
import { IUser } from "../../../../../interfaces/models/IUser";
import { Region } from "../../../../../models/regionModel";
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
    async findRegionById(regionId:string): Promise<IRegion[] | null> {
        return await Region.aggregate([
            { $match: { _id:regionId } },
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
}
