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

    async findAllAccountabilityByDate(userId: string, date?: string): Promise<IAccountablity[]> {
        // If no date is provided, use today
        const queryDate = date ? new Date(date) : new Date();

        // Set start and end of the day
        const startOfDay = new Date(queryDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(queryDate);
        endOfDay.setHours(23, 59, 59, 999);

        const res = await AccountablitySlip.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: {
                        $gte: startOfDay,
                        $lte: endOfDay,
                    },
                },
            },
        ]);

        return res;
    }

    async findAllNextMeeting(userId: string): Promise<IAccountablity | null> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextMeeting = await AccountablitySlip.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: today },
        }).sort({ date: 1 });

        return nextMeeting;
    }

    async findAllThisWeekMeetings(userId: string): Promise<IAccountablity[]> {
        const today = new Date();

        // Start of the week (Monday)
        const startOfWeek = new Date(today);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

        // End of the week (Sunday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const meetings = await AccountablitySlip.find({
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: startOfWeek, $lte: endOfWeek },
        }).sort({ date: 1 });

        return meetings;
    }

    async getUpcomingAndNextMeeting(userId: string) {
        const nowUtc = new Date(new Date().toISOString());

        const nextMeeting = await AccountablitySlip.find({
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: new Date() }, // compare with UTC date
        })
          .sort({ date: 1 }) // get earliest upcoming meeting
          .exec();
      console.log(nextMeeting)
        return nextMeeting;
     
    }



}
