import { UpdateWriteOpResult } from "mongoose";
import { IUser } from "../../../../../interfaces/models/IUser";
import User from "../../../../../models/userModel";

export class AuthRepository {
    async createUser(userData: IUser) {
        try {
            const newUser = new User(userData);
            await newUser.save();
            return newUser;
        } catch (error) {
            console.log(`Database erro: ${"Error while creating user"}`);
            throw error;
        }
    }

    async findOne(userId: string): Promise<any> {
        return await User.findOne({ _id: userId });
    }
    async findUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email: email }).lean();
        } catch (error) {
            throw error;
        }
    }
    async findByEmailOrPhoneNumber(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email: email }).lean();
        } catch (error) {
            throw error;
        }
    }
    async findByPhoneNumber(phoneNumber: number): Promise<IUser | null> {
        try {
            return await User.findOne({ phonenumber:phoneNumber }).lean();
        } catch (error) {
            throw error;
        }
    }

    async deleteUserById(userId: any) {
        try {
            return await User.deleteOne({ _id: userId });
        } catch (error) {
            throw error;
        }
    }
    async updatePassword(password: string, userId: string): Promise<UpdateWriteOpResult> {
        try {
            return await User.updateOne({ _id: userId }, { $set: { password: password } });
        } catch (error) {
            throw error;
        }
    }

}
