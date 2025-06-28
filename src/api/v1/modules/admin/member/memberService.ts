import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";
import { IUser } from "../../../../../interfaces/models/IUser";
import { registrationRejectedHtml } from "../../../../../utils/v1/mail/htmlGenerator";
import { sendLinkToEmail } from "../../../../../utils/v1/mail/sendEmail";
import { UserRepository } from "../../shared/repositories/userRepository";
import { MemberRepository } from "./memberRepository";

export class MemberService {
    constructor(private memberRepository: MemberRepository, private userRepository: UserRepository) {}

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
        // await this.userRepository.deleteById(userId);
    }
}
