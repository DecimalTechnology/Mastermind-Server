import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";
import { IUser } from "../../../../../interfaces/models/IUser";
import User from "../../../../../models/userModel";
import { registrationAcceptedHtml, registrationRejectedHtml } from "../../../../../utils/v1/mail/htmlGenerator";
import { sendLinkToEmail } from "../../../../../utils/v1/mail/sendEmail";
import { generateRandomPassword } from "../../../../../utils/v1/password/generateRandomPassword";
import { hashPassword } from "../../../../../utils/v1/password/password";
import { UserRepository } from "../../shared/repositories/userRepository";
import { ProfileRepository } from "../../user/profile/profileRepository";
import { MemberRepository } from "./memberRepository";
import { Chapter } from "../../../../../models/chapterModal";

export class MemberService {
    constructor(
        private memberRepository: MemberRepository,
        private userRepository: UserRepository,
        private profileRepository: ProfileRepository,
    ) {}

    async blockUser(userId: string): Promise<IUser> {
        return await this.userRepository.blockUser(userId);
    }
    async unblockUser(userId: string): Promise<IUser> {
        return await this.userRepository.unblockUser(userId);
    }
    async rejectUser(userId: string, reason: string): Promise<any> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundError("The user not found");
        if (user?.isVerified) throw new BadRequestError("The user already verified, Can't reject");

        const email = user?.email;
        const html = registrationRejectedHtml(user?.name, reason);
        await sendLinkToEmail(email, "", html);

        await this.userRepository.deleteById(userId);
    }
    async acceptUser(userId: string): Promise<any> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundError("The user you are trying to accept is not found");
        if (user?.isVerified) throw new BadRequestError("User already verified");
        const email = user?.email;
        const randomPassword = generateRandomPassword();
        const html = registrationAcceptedHtml(user?.name, randomPassword);
        const isEmailSend = await sendLinkToEmail(email, "", html);
        if (!isEmailSend) throw new BadRequestError("Something went wrong while sending the email to the user");
        const hashedPassword = await hashPassword(randomPassword);
        const profileData = { userId: user?._id, email: user?.email, phoneNumbers: [user?.phonenumber] };
        await this.memberRepository.createInitialProfile(profileData);

        return await this.userRepository.findByIdAndUpdate(user?._id, { password: hashedPassword, isVerified: true });
    }
    async getAllMembers(type: string, id: string): Promise<any> {
        let result;
        const ObjectId = new mongoose.Types.ObjectId(id);
        if (type == "chapter") {
            result = await User.find({ chapter: ObjectId });
        }
        if (type == "local") {
            const chapters = await Chapter.find({ localId: ObjectId }, { _id: 1 });
            const chapterObjectIds = chapters?.map((obj: any) => {
                return obj?._id;
            });
            result = await User.find({ chapter: { $in: chapterObjectIds } });
        }
        if (type == "region") {
            const chapters = await Chapter.find({ regionId: ObjectId }, { _id: 1 });
            const chapterObjectIds = chapters?.map((obj: any) => {
                return obj?._id;
            });
            result = await User.find({ chapter: { $in: chapterObjectIds } });
        }
        if (type == "nation") {
            const chapters = await Chapter.find({ nationId: ObjectId }, { _id: 1 });
            const chapterObjectIds = chapters?.map((obj: any) => {
                return obj?._id;
            });
             
            result = await User.find({ chapter: { $in: chapterObjectIds } });
           
        }

        return result||[]
    }
}
