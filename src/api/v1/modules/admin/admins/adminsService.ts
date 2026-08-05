import mongoose from "mongoose";
import User from "../../../../../models/userModel";
import { Region } from "../../../../../models/regionModel";
import { Local } from "../../../../../models/localModel";
import { Chapter } from "../../../../../models/chapterModal";
import { NotFoundError, BadRequestError } from "../../../../../constants/customErrors";
import { UserRole } from "../../../../../enums/common";

export class AdminsService {
    async searchUsers(searchQuery: string): Promise<any[]> {
        const query: any = {};
        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } }
            ];
        }
        return await User.find(query, { name: 1, email: 1, role: 1 }).limit(20);
    }

    async assignRole(userId: string, role: string, entityId?: string): Promise<any> {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (!Object.values(UserRole).includes(role as any)) {
            throw new BadRequestError("Invalid role value");
        }

        let manageObj: any = null;

        if (role === UserRole.REGIONAL_ADMIN) {
            if (!entityId) throw new BadRequestError("Region ID is required for Region Admin");
            manageObj = { region: new mongoose.Types.ObjectId(entityId) };
        } else if (role === UserRole.LOCAL_ADMIN) {
            if (!entityId) throw new BadRequestError("Local Area ID is required for Local Admin");
            manageObj = { local: new mongoose.Types.ObjectId(entityId) };
        } else if (role === UserRole.CORE_TEAM_ADMIN) {
            if (!entityId) throw new BadRequestError("Chapter ID is required for Coreteam Member");
            manageObj = { chapter: new mongoose.Types.ObjectId(entityId) };
        }

        user.role = role as UserRole;
        user.manage = manageObj;
        return await user.save();
    }

    async getRegions(): Promise<any[]> {
        return await Region.find({ isActive: true }, { name: 1 });
    }

    async getLocals(): Promise<any[]> {
        return await Local.find({ isActive: true }, { name: 1 });
    }

    async getChapters(): Promise<any[]> {
        return await Chapter.find({ isActive: true }, { name: 1 });
    }
}
