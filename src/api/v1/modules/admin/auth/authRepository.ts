import { UserRole } from "../../../../../enums/common";
import { IUser } from "../../../../../interfaces/models/IUser";
import Profile from "../../../../../models/profileModel";
import User from "../../../../../models/userModel";

export class AuthRepository {
    async updateUserIsVerified(userId: string, password: string): Promise<IUser | null> {
        try {
            return await User.findOneAndUpdate({ _id: userId }, { $set: { isVerified: true, password: password } }, { new: true });
        } catch (error) {
            throw error;
        }
    }
    async findByEmail(email: string): Promise<any> {
        return await User.findOne({ email: email });
    }
    async findAll() {
        return await User.find();
    }

    async findAdmin(id: string, role: string) {
      const from =
    role == UserRole.NATIONAL_ADMIN
        ? "nations"
        : role == UserRole.REGIONAL_ADMIN
        ? "regions"
        : role == UserRole.LOCAL_ADMIN
        ? "locals"
        : "chapters";

const localField =
    role == UserRole.NATIONAL_ADMIN
        ? "nation"
        : role == UserRole.REGIONAL_ADMIN
        ? "region"
        : role == UserRole.LOCAL_ADMIN
        ? "local"
        : "chapter";

return await User.aggregate([
    { $match: { _id: id } },
    {
        $lookup: {
            from: from,
            localField: `manage.${localField}`,
            foreignField: "_id",
            as: "manageInfo"
        }
    }
]);

    }

    async findOne(userId: string): Promise<any> {
        return await User.findOne({ _id: userId });
    }
    async createProfile(profileData: any): Promise<Record<string, any> | null> {
        try {
            const newProfile = new Profile(profileData);
            await newProfile.save();
            return new Profile();
        } catch (error) {
            throw error;
        }
    }
}
