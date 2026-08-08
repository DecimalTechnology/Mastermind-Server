import mongoose from "mongoose";
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
            {
                $match: search ? { name: { $regex: search, $options: "i" } } : {},
            },
            {
                $lookup: {
                    from: "nations",
                    localField: "nationId",
                    foreignField: "_id",
                    as: "nationData",
                },
            },
            {
                $lookup: {
                    from: "regions",
                    localField: "regionId",
                    foreignField: "_id",
                    as: "regionData",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "manage.local",
                    as: "adminData",
                },
            },
            { $unwind: { path: "$nationData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$regionData", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$adminData", preserveNullAndEmptyArrays: true } },
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

        // Get all chapters under this local
        const chapters = await Chapter.find({ localId: local?._id }).populate("createdBy");
        const chapterIds = chapters.map(c => c._id);

        // Get users who belong to or manage any of those chapters
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

        // Get events under those chapters
        const events = await Event.find({ chapterId: { $in: chapterIds } }).populate("chapterId");

        // Get local events
        const localEvents = await Event.find({ localId: local?._id, eventType: "local" });

        // Get local area admins who manage this local area
        const localAdmins = await User.find({
            role: "local_admin",
            "manage.local": local?._id
        });

        return {
            local: local,
            chapters,
            members,
            events,
            localEvents,
            localAdmins,
        };
    }

    async getCoreTeamByChapter(chapterId: string): Promise<any[]> {
        return await User.find({
            "manage.chapter": new mongoose.Types.ObjectId(chapterId),
            role: "core_team_admin"
        });
    }

    async searchChapterMembers(chapterId: string, search: string): Promise<any[]> {
        const query: any = {
            chapter: new mongoose.Types.ObjectId(chapterId),
            role: "member"
        };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        return await User.find(query).limit(10);
    }

    async updateCoreTeamRole(userId: string, isAdd: boolean, chapterId?: string): Promise<any> {
        const user = await User.findById(userId);
        if (!user) {
            return null;
        }

        if (isAdd) {
            user.role = "core_team_admin" as any;
            user.manage = { chapter: new mongoose.Types.ObjectId(chapterId) };
        } else {
            user.role = "member" as any;
            user.manage = undefined;
        }

        return await user.save();
    }
}
