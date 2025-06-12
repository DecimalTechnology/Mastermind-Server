import { INation } from "../../../../../interfaces/models/INation";
import { IUser } from "../../../../../interfaces/models/IUser";
import { Nation } from "../../../../../models/nationModel";
import User from "../../../../../models/userModel";
import { NationRepository } from "../../shared/repositories/nationRepository";

export class SuperAdminRepository {
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
    async searchBySearchQuery(search: string): Promise<INation[] | []> {
        return await Nation.find({ name: { $regex: search, $options: "i" } }).populate({path:"createdBy",select:"name"})
    }
}
