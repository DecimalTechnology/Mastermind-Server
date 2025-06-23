import mongoose from "mongoose";
import { ITycb } from "../../../../../interfaces/models/ITycb";
import TYCB, { BusinessType } from "../../../../../models/TYDBModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class TYCBRepository extends BaseRepository<ITycb> {
    constructor() {
        super(TYCB);
    }

    async getAllTycb(userId: string): Promise<ITycb[]> {
        return await TYCB.aggregate([
            { $match: { toUser: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    localField: "fromUser",
                    foreignField: "_id",
                    from: "users",
                    as: "userData",
                    pipeline: [{ $project: { name: 1, _id: 0, email: 1 } }],
                },
            },
            { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    localField: "fromUser",
                    foreignField: "userId",
                    from: "profiles",
                    as: "profileData",
                    pipeline: [{ $project: { image: 1,_id:0 } }],
                },
            },
            { $unwind: { path: "$profileData", preserveNullAndEmptyArrays: true } },
            {$project:{message:1,BusinessType:1,amount:1,image:"$profileData.image",name:"$userData.name",email:"$userData.email",createdAt:1,}}
        ]);
    }
    async getAllSentTycb(userId: string): Promise<ITycb[]> {
        return await TYCB.aggregate([
            { $match: { fromUser: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    localField: "toUser",
                    foreignField: "_id",
                    from: "users",
                    as: "userData",
                    pipeline: [{ $project: { name: 1, _id: 0, email: 1 } }],
                },
            },
            { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    localField: "toUser",
                    foreignField: "userId",
                    from: "profiles",
                    as: "profileData",
                    pipeline: [{ $project: { image: 1,_id:0 } }],
                },
            },
            { $unwind: { path: "$profileData", preserveNullAndEmptyArrays: true } },
            {$project:{message:1,BusinessType:1,amount:1,image:"$profileData.image",name:"$userData.name",email:"$userData.email",createdAt:1,}}
        ]);
    }
}
