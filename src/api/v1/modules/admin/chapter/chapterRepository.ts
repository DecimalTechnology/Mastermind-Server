import mongoose from "mongoose";
import { IChapter } from "../../../../../interfaces/models/IChaper";
import { IUser } from "../../../../../interfaces/models/IUser";
import { Chapter } from "../../../../../models/chapterModal";
import { Local } from "../../../../../models/localModel";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";
import Event from "../../../../../models/eventModel";

export class ChapterRepository extends BaseRepository<IChapter> {
    constructor() {
        super(Chapter);
    }

    async findAllChapters(search: string): Promise<any> {
        const res = await Chapter.aggregate([
            { $match: { name: { $regex: search, $options: "i" } } },
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
                    from: "locals",
                    localField: "localId",
                    foreignField: "_id",
                    as: "localData",
                },
            },
            { $unwind: "$localData" },
            { $unwind: "$nationData" },
            { $unwind: "$regionData" },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    createdAt: 1,
                    createdBy: "$createdBy.name",
                    updatedAt: 1,
                    localData: "$localData.name",
                    regionData: "$regionData.name",
                    nationData: "$nationData.name",
                    coreTeamCount: { $size: "$coreTeam" },
                    membersCount: { $size: "$members" },
                },
            },
        ]);

        return res;
    }
    async findChapterById(chapterId: string): Promise<IChapter[]> {
        const res = await Chapter.aggregate([
            { $match: { _id: chapterId } },
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
                    from: "locals",
                    localField: "localId",
                    foreignField: "_id",
                    as: "localData",
                },
            },
            { $unwind: "$localData" },
            { $unwind: "$nationData" },
            { $unwind: "$regionData" },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    createdAt: 1,
                    createdBy: "$createdBy.name",
                    updatedAt: 1,
                    localData: "$localData.name",
                    regionData: "$regionData.name",
                    nationData: "$nationData.name",
                    coreTeamCount: { $size: "$coreTeam" },
                    membersCount: { $size: "$members" },
                },
            },
        ]);

        return res;
    }

    async findUsersBySearch(search: string): Promise<IUser[]> {
        return await User.aggregate([{ $match: { name: { $regex: search, $options: "i" } } }, { $match: { role: "member" } }]);
    }
    async findChapterDetailsById(chapterId: string): Promise<IUser[]> {
        return await User.find();
    }
    async findChaptersByLocalId(localId: string): Promise<IChapter[]> {
        return await Chapter.find({ localId: localId });
    }
    async findAllUsersByLevel(level: string, levelId: string, search: string): Promise<any> {
        if (level == "chapter") {
            return await User.aggregate([
                { $match: { chapter: new mongoose.Types.ObjectId(levelId) } },
                { $match: { name: { $regex: search, $options: "i" } } },
            ]);
        }

        if (level == "region") {
        }

        if (level == "local") {
        }

        if (level == "nation") {
        }
        if (level == "global") {
        }
        console.log(level, levelId, search);
        return "";
    }

    async findChapter(chapterId: string): Promise<any> {
        return await Chapter.findOne({ _id: chapterId }).populate("localId").populate("regionId").populate("nationId");
    }
    async findMembersByChapterId(chapterId: string, query: any): Promise<any> {
        const { search, page, status } = query;

        return await Chapter.findOne({ _id: chapterId }).populate("localId").populate("regionId").populate("nationId");
    }

    async findChapterByChapterId(chapterId: string): Promise<any> {
        const result   = await Promise.all([
            Chapter.findById(chapterId).populate("regionId").populate("nationId").populate("localId").populate("createdBy"),
            User.find({ "manage.chapter": new mongoose.Types.ObjectId(chapterId) }),
            User.countDocuments({ chapter: chapterId }),
            Event.countDocuments({chapterId:chapterId})
        ]);

        return result;
    }
}
