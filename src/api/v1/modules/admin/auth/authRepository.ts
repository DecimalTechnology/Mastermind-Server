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
    async findByEmail(email: string):Promise<any> {
        return await User.findOne({ email: email });
    }
    async findAll() {
        return await User.find();
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
