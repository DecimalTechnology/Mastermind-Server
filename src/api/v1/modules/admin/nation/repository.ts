import { INation } from "../../../../../interfaces/models/INation";
import { IUser } from "../../../../../interfaces/models/IUser";
import { Nation } from "../../../../../models/nationModel";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class NationRepository extends BaseRepository<INation> {
    constructor() {
        super(Nation);
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

    async createNation(nationObj: any): Promise<INation> {
        const newNation = new Nation(nationObj);
        await newNation.save();
        return newNation;
    }

    async updateManageField(userId: string, data: any): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, { manage: data });
    }
    // Find All nations
    async searchBySearchQuery(search: string): Promise<INation[] | []> {
        const res = await Nation.aggregate([
            { $match: { name: { $regex: search, $options: "i" } } },
            { $lookup: { from: "users", localField: "_id", foreignField: "manage.nation", as: "admin" } },
            { $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "createdBy" } },
        ]);

        return res;
    }
}
