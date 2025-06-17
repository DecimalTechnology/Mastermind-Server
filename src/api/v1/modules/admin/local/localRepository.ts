import { ILocal } from "../../../../../interfaces/models/ILocal";
import { IRegion } from "../../../../../interfaces/models/IRegion";
import { IUser } from "../../../../../interfaces/models/IUser";
import { Local } from "../../../../../models/localModel";
import { Region } from "../../../../../models/regionModel";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class LocalRepository extends BaseRepository<ILocal> {
    constructor() {
        super(Local);
    }

    async findAllUsersBySerachQuery(search: string): Promise<IUser[]> {
        return await User.aggregate([
            {
                $match: {
                    name: { $regex: search, $options: "i" },
                    role: "member",
                },
            },
        ]);
    }

    async findAllLocals(search: string, regionId: string): Promise<any> {
        const res = await Local.aggregate([
            { $match: { name: { $regex: search, $options: "i" } } },
            { $lookup: { from: "nations", localField: "nationId", foreignField: "_id", as: "nationData" } },
            { $lookup: { from: "regions", localField: "regionId", foreignField: "_id", as: "regionData" } },
            { $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "createdBy" } },
            { $lookup: { from: "users", localField: "_id", foreignField: "manage.local", as: "adminData" } },
            { $unwind: "$nationData" },
            { $unwind: "$regionData" },
            { $unwind: "$createdBy" },
            { $unwind: "$adminData" },
            {
                $project: {
                    nation: "$nationData.name",
                    region: "$regionData.name",
                    admin: "$adminData.name",
                    createdBy: "$createdBy.name",
                    isActive: 1,
                    name: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);

        const region = await Region.findOne({ _id: regionId });
        return { region: region, local: res };
    }

    async findLocalData(id: string): Promise<ILocal[] | null> {
        const res = await Local.aggregate([
            { $match: { _id: id } },
            { $lookup: { from: "nations", localField: "nationId", foreignField: "_id", as: "nationData" } },
            { $lookup: { from: "regions", localField: "regionId", foreignField: "_id", as: "regionData" } },
            { $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "createdBy" } },
            { $lookup: { from: "users", localField: "_id", foreignField: "manage.local", as: "adminData" } },
            { $unwind: "$nationData" },
            { $unwind: "$regionData" },
            { $unwind: "$createdBy" },
            { $unwind: "$adminData" },
            {
                $project: {
                    nation: "$nationData.name",
                    region: "$regionData.name",
                    admin: "$adminData.name",
                    createdBy: "$createdBy.name",
                    isActive: 1,
                    name: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);

        return res;
    }
    async findLocalsByRegionId(regionId: string): Promise<ILocal[]> {
        return await Local.find({ regionId: regionId });
    }
}
