import mongoose, { Types } from "mongoose";
import { IUser } from "../../../../../interfaces/models/IUser";
import User from "../../../../../models/userModel";
import { BaseRepository } from "./baseRepository";
import { pipeline } from "stream";
import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }

    async updateCoreTeamData(coreTeams: any, data: any): Promise<any> {
        const objectIds = coreTeams.map((ids: any) => new Types.ObjectId(ids));
        return await User.updateMany({ _id: { $in: objectIds } }, { $set: data });
    }

    async findMembersByChapterId(chapterId: string, query: any): Promise<any> {
        const { search = "", status } = query;

        const matchStage: any = {
            chapter: new mongoose.Types.ObjectId(chapterId),
        };

        if (search) {
            matchStage.name = { $regex: search, $options: "i" };
        }
        matchStage.role = "member";

        if (status === "Pending") {
            matchStage.isVerified = false;
        } else if (status === "Approved") {
            matchStage.isVerified = true;
            matchStage.isBlocked=false
        } else if (status === "Blocked") {
            matchStage.isBlocked = true;
        }

        const pipeline: any = [{ $match: matchStage }, { $sort: { _id: -1 } }];
        const pendingCount = await User.aggregate([{ $match: { chapter: new mongoose.Types.ObjectId(chapterId), isVerified: false } }]);
        const users = await User.aggregate(pipeline);
        const totalPage = await User.find({chapter:chapterId});
        return { users: users, pendingCount: pendingCount.length,totalPage:totalPage };
    }

    async blockUser(userId: string): Promise<IUser> {
        const user = await User.findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: true } },{new:true});
        if (!user) throw new NotFoundError("User not found with this Id");
        

        return user;
    }
    async unblockUser(userId: string): Promise<IUser> {
        const user = await User.findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: false } },{new:true});
        if (!user) throw new NotFoundError("User not found with this Id");
        
        return user;
    }
}
