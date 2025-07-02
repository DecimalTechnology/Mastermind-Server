import mongoose from "mongoose";
import { IAccountablity } from "../../../../../interfaces/models/IAccountablity";
import AccountablitySlip from "../../../../../models/accountabilitySlip";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class AccountablityRepository extends BaseRepository<IAccountablity> {
    constructor() {
        super(AccountablitySlip);
    }

    async findAllAccountability(userId: string): Promise<IAccountablity[]> {
        const res = await AccountablitySlip.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "profiles",
                    localField: "members",
                    foreignField: "userId",
                    as: "memberProfiles",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "memberUsers",
                },
            },
            {
                $project: {
                    _id: 1,
                    place: 1,
                    date: 1,
                    time: 1,
                    userId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    members: {
                        $map: {
                            input: "$members",
                            as: "memberId",
                            in: {
                                userId: "$$memberId",
                                name: {
                                    $let: {
                                        vars: {
                                            matchedUser: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$memberUsers",
                                                            as: "user",
                                                            cond: { $eq: ["$$user._id", "$$memberId"] },
                                                        },
                                                    },
                                                    0,
                                                ],
                                            },
                                        },
                                        in: "$$matchedUser.name",
                                    },
                                },
                                email: {
                                    $let: {
                                        vars: {
                                            matchedProfile: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$memberProfiles",
                                                            as: "profile",
                                                            cond: { $eq: ["$$profile.userId", "$$memberId"] },
                                                        },
                                                    },
                                                    0,
                                                ],
                                            },
                                        },
                                        in: "$$matchedProfile.email",
                                    },
                                },
                                image: {
                                    $let: {
                                        vars: {
                                            matchedProfile: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$memberProfiles",
                                                            as: "profile",
                                                            cond: { $eq: ["$$profile.userId", "$$memberId"] },
                                                        },
                                                    },
                                                    0,
                                                ],
                                            },
                                        },
                                        in: "$$matchedProfile.image",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ]);
        
        return res;
    }
}
