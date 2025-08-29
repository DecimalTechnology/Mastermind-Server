import { ILocal } from "../../../../../interfaces/models/ILocal";
import { IRegion } from "../../../../../interfaces/models/IRegion";
import { IUser } from "../../../../../interfaces/models/IUser";
import { Chapter } from "../../../../../models/chapterModal";
import Event from "../../../../../models/eventModel";
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
    async findLocalDetails(adminId: string): Promise<any> {
        const user: any = await User.findById(adminId);

        const local: any = await Local.findOne({ _id: user?.manage?.local }).populate("nationId").populate("regionId").populate("createdBy");

        // Get all chapter _id's under this local
        const chapterIds = await Chapter.distinct("_id", { localId: local?._id });

        // Get users who belong to any of those chapters (if user has chapterId field)
        const members = await User.find({
            $and: [{ chapter: { $in: chapterIds } }, { role: { $in: ["member", "core_team_admin", "chapter_admin"] } }],
        });

        // Get events under those chapters
        const events = await Event.find({ chapterId: { $in: chapterIds } });

        return {
            local: local,
            members,
            events,
        };
    }
}
