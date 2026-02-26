import mongoose from "mongoose";
import { IAccountablity } from "../../../../../interfaces/models/IAccountablity";
import AccountablitySlip from "../../../../../models/accountabilitySlip";
import { BaseRepository } from "../../shared/repositories/baseRepository";
import User from "../../../../../models/userModel";
import { Chapter } from "../../../../../models/chapterModal";
import MeetingModel from "../../../../../models/MeetingModel";
import { FilterRuleName } from "@aws-sdk/client-s3";

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

    async findAllAccountabilityByDate(userId: string, date: string, sort: string): Promise<any> {
        const user: any = await User.findById(userId);
        
        const chapterId = user?.chapter;

        const chapter = await Chapter.findById(chapterId);

        const localId = chapter?.localId;
        const regionId = chapter?.regionId;
        const nationId = chapter?.nationId; // ⚠️ you had mistake here earlier
    
        let filter: any = {};

        if (sort === "chapter") {
            filter.referenceId = chapterId;
        }

        if (sort === "local") {
            filter.referenceId = localId;
        }

        if (sort === "region") {
            filter.referenceId = regionId;
        }

        if (sort === "nation") {
            filter.referenceId = nationId;
        }

        // Convert incoming date string to Date object
        const selectedDate = new Date(date);

        // Reset time to match only date
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

       // Add date filter for array field
        filter.dates = {
            $elemMatch: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        };

        const meeting = await MeetingModel.find(filter);
       
        return meeting;
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
            $or: [{ userId: new mongoose.Types.ObjectId(userId) }, { members: { $in: new mongoose.Types.ObjectId(userId) } }],

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
        console.log(nextMeeting);
        return nextMeeting;
    }

    async getAllMeetingByAdminId(pipeline: any): Promise<IAccountablity[] | []> {
        return await AccountablitySlip.aggregate(pipeline);
    }

    async findNextMeeting(user: any): Promise<any> {
        const chapterId = user?.chapter;

        const chapter = await Chapter.findById(chapterId);

        const localId = chapter?.localId;
        const regionId = chapter?.regionId;
        const nationId = chapter?.nationId;

        const findArr = [new mongoose.Types.ObjectId(chapterId), new mongoose.Types.ObjectId(localId), new mongoose.Types.ObjectId(regionId), new mongoose.Types.ObjectId(nationId)];

        const meeting = await MeetingModel.find({ referenceId: { $in: findArr } })
            .sort({ "dates.0": 1 })
            .limit(1);

        return meeting[0];
    }

    async findWeeklyMeetings(user: any): Promise<any> {
        const chapterId = user?.chapter;

        const chapter = await Chapter.findById(chapterId);

        const findArr = [
            new mongoose.Types.ObjectId(chapterId),
            new mongoose.Types.ObjectId(chapter?.localId),
            new mongoose.Types.ObjectId(chapter?.regionId),
            new mongoose.Types.ObjectId(chapter?.nationId),
        ];

        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const meetings = await MeetingModel.find({
            referenceId: { $in: findArr },
            dates: {
                $elemMatch: {
                    $gte: startOfWeek,
                    $lt: endOfWeek,
                },
            },
        }).sort({ "dates.0": 1 });

        return meetings;
    }
}
