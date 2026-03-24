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
import AccountablitySlip from "../../../../../models/accountabilitySlip";
import MeetingModel from "../../../../../models/MeetingModel";
import Event from "../../../../../models/eventModel";

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

        return result || [];
    }
    async getMemberById(memberId: string): Promise<any> {
        const member = await User.findOne({ _id: new mongoose.Types.ObjectId(memberId) }, { password: 0 });
        if (!member) throw new NotFoundError("Member not found");
        return member;
    }
    async getMemberAccountablityHistory(memberId: string): Promise<any> {
        const userObjectId = new mongoose.Types.ObjectId(memberId);
        const user = await User.findById(userObjectId, { password: 0 });
        if (!user) throw new NotFoundError("User not found");
        const [givenAccountability, receivedAccountability] = await Promise.all([
            AccountablitySlip.find({
                userId: userObjectId,
                isDeleted: false,
            }).populate("members", "name _id"),

            AccountablitySlip.find({
                members: userObjectId,
                isDeleted: false,
            }).populate("members", "name _id"),
        ]);

        return {
            givenAccountability,
            receivedAccountability,
            user,
        };
    }
    async getMemberMeetingDetails(memberId: string): Promise<any> {
        const memberObjectId = new mongoose.Types.ObjectId(memberId);
        const user = await User.findById(memberObjectId);
        if (!user) throw new NotFoundError("User not found");
        const totalMeeting = await MeetingModel.countDocuments({ referenceId: new mongoose.Types.ObjectId(user?.chapter) });

        const attendedMeetings = await MeetingModel.find({ participants: memberObjectId, referenceId: new mongoose.Types.ObjectId(user?.chapter) }, { _id: 1, location: 1 }).lean();

        return { totalMeeting, attendedMeetings };
    }
    async getMemberEventDetails(memberId: string): Promise<any> {
        const memberObjectId = new mongoose.Types.ObjectId(memberId);

        const user: any = await User.findById(memberObjectId);
        if (!user) throw new NotFoundError("User not found");

        const chapterId = user?.chapter;
        

        const [totalEvents, registeredEvents, invitedEvents] = await Promise.all([
            Event.find({ chapterId: chapterId }, { name: 1, _id: 1 }).lean(),
            Event.find({ chapterId: chapterId, rsvp: memberObjectId }, { name: 1, _id: 1 }).lean(),
            Event.find({ eventType: "all", chapterId: chapterId, attendees: memberObjectId }, { name: 1, _id: 1 }).lean(),
        ]);

        return { totalEvents, invitedEvents, registeredEvents };
    }

    
    async getMemberConnectionDetails(memberId: string): Promise<any> {
        const memberObjectId = new mongoose.Types.ObjectId(memberId);

        const user: any = await User.findById(memberObjectId);
        if (!user) throw new NotFoundError("User not found");

        const chapterId = user?.chapter;
        

        const [totalEvents, registeredEvents, invitedEvents] = await Promise.all([
            Event.find({ chapterId: chapterId }, { name: 1, _id: 1 }).lean(),
            Event.find({ chapterId: chapterId, rsvp: memberObjectId }, { name: 1, _id: 1 }).lean(),
            Event.find({ eventType: "all", chapterId: chapterId, attendees: memberObjectId }, { name: 1, _id: 1 }).lean(),
        ]);

        return { totalEvents, invitedEvents, registeredEvents };
    }
}
