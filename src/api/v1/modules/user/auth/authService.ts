import { BadRequestError, ConflictError, NotFoundError, UnAuthorizedError } from "../../../../../constants/customErrors";
import { forgetPasswordMessage } from "../../../../../constants/messages";
import { UserRole } from "../../../../../enums/common";
import Otp from "../../../../../models/otpModel";
import User from "../../../../../models/userModel";
import { generateEmailHtml, generateOtpEmailHtml, sendOtpHtml } from "../../../../../utils/v1/mail/htmlGenerator";
import { sendLinkToEmail } from "../../../../../utils/v1/mail/sendEmail";
import { generateOtp } from "../../../../../utils/v1/otp/generateOtp";
import { generateRandomPassword } from "../../../../../utils/v1/password/generateRandomPassword";
import { comparePassword, hashPassword } from "../../../../../utils/v1/password/password";
import { generateAccessToken, generateRefreshToken } from "../../../../../utils/v1/token/token";
import { ChapterRepository } from "../../admin/chapter/chapterRepository";
import { LocalRepository } from "../../admin/local/localRepository";
import { NationRepository } from "../../admin/nation/repository";
import { RegionRepository } from "../../admin/region/regionRepository";
import { AuthRepository } from "./authRepository";

export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private nationRepository: NationRepository,
        private regionRepository: RegionRepository,
        private localRepository: LocalRepository,
        private chapterRepository: ChapterRepository
    ) {}

    async userRegistration(userData: any) {
        try {
            // Convert mobile number from string to number
            const phoneNumber = parseInt(userData?.phonenumber);
            // Checking email and password already exists or not
            const emailExists = await this.authRepository.findUserByEmail(userData?.email);
            const phoneNumberExists = await this.authRepository.findByPhoneNumber(phoneNumber);
            // If exists throw new error

            if (emailExists) throw new ConflictError("The email already exists");
            if (phoneNumberExists) throw new ConflictError("The phonenumber  already exists");

            const newUserData = { ...userData, phonenumber: phoneNumber, role: UserRole.MEMBER, password: "" };

            return await this.authRepository.createUser({ ...newUserData, password: "" });
        } catch (error) {
            console.log("User registration error");
            throw error;
        }
    }

    async userLogin(userData: { email: string; password: string }) {
        try {
            const user = await this.authRepository.findUserByEmail(userData?.email);

            if (!user) {
                throw new NotFoundError("Invalid user");
            }

            // Check if the user is verified
            if (!user?.isVerified) {
                throw new BadRequestError("Your account is pending verification by an admin. Please wait until the verification is complete");
            }

            // Check if the user is blocked
            if (user?.isBlocked) {
                throw new BadRequestError("Your account has been blocked by the admin");
            }

            // Check if the password is valid
            const isPasswordValid = await comparePassword(userData?.password, user?.password as string);

            if (!isPasswordValid) {
                throw new BadRequestError("Password you entered is incorrect");
            }

            // Generate tokens
            const accessToken = generateAccessToken(user?._id as string);
            const refreshToken = generateRefreshToken(user?._id);

            // Exclude the password field from the user object
            const { password, ...newUser } = user;

            // Return the user and tokens
            return { user: newUser, accessToken, refreshToken };
        } catch (error) {
            console.log("User login error");
            throw error;
        }
    }

    async resetPassword(oldPassword: string, newPassword: string, userId: string): Promise<string> {
        try {
            const user = await this.authRepository.findOne(userId);
            if (!user) throw new NotFoundError("User not found");

            const compare = await comparePassword(oldPassword, user?.password);

            if (!compare) throw new BadRequestError("The old password you enter is incorrect please provide a valid password");

            const hashedPassword = await hashPassword(newPassword);
            const res = await this.authRepository.updatePassword(hashedPassword, userId);
            if (res?.modifiedCount <= 0) throw new BadRequestError("Password updation failed");
            return "Password updated sucessfully";
        } catch (error) {
            throw error;
        }
    }
    async forgetPassword(email: string, otp: string): Promise<{ email: string; otp: string }> {
        try {
            const user = await this.authRepository.findUserByEmail(email);
            if (!user) throw new BadRequestError("Invaild email address ");
            const message = forgetPasswordMessage(otp);
            const html = generateOtpEmailHtml(user?.name, otp);
            const isEmailSend = await sendLinkToEmail(email, "", html);
            if (!isEmailSend) throw new BadRequestError("Somthing went wrong while sending email to the user");
            return { email, otp };
        } catch (error) {
            throw error;
        }
    }
    async updateForgetPassword(email: string, password: string): Promise<any> {
        try {
            const user = await this.authRepository.findUserByEmail(email);
            if (!user) throw new BadRequestError("No valid user found with this email ");
            if (!user?.isVerified) throw new UnAuthorizedError("Your account is not verified by the admin");
            const samePassword = await comparePassword(password, user?.password as string);
            const hashedPassword = await hashPassword(password);
            if (samePassword)
                throw new BadRequestError("Your new password cannot be the same as your old password. Please choose a different password.");
            const res = await this.authRepository.updatePassword(hashedPassword, user?._id);
            if (res?.modifiedCount > 0) return;
            throw new BadRequestError("Something went wrong password updation failed");
        } catch (error) {
            console.log("Error: forget password");
            throw error;
        }
    }
    async getAllNations(): Promise<any> {
        try {
            return await this.nationRepository.findAll();
        } catch (error) {
            throw error;
        }
    }
    async getAllRegions(nationId: string): Promise<any> {
        try {
            return await this.regionRepository.findAllRegionsByNationId(nationId as string);
        } catch (error) {
            throw error;
        }
    }
    async getAllLocalsByRegionId(regionId: string): Promise<any> {
        try {
            return await this.localRepository.findLocalsByRegionId(regionId as string);
        } catch (error) {
            throw error;
        }
    }
    async getAllChaptersByLocalId(localId: string): Promise<any> {
        try {
            return await this.chapterRepository.findChaptersByLocalId(localId as string);
        } catch (error) {
            throw error;
        }
    }
    async sendOtp(email: string): Promise<any> {
        try {
            const user = await this.authRepository.findUserByEmail(email);
            if (user) throw new ConflictError("The email already registered");
            const otp = generateOtp();

            const html = sendOtpHtml(otp);
            const isEmailSend = await sendLinkToEmail(email, "", html);
            if (!isEmailSend) throw new BadRequestError("Failed to send OTP to the email");
            const otpExists = await Otp.findOne({ email: email });
            if (otpExists) await Otp.updateOne({ email: email }, { $set: { otp: otp } });
            else await Otp.create({ email: email, otp: otp });
            return { email: email, otp: otp };
        } catch (error) {
            throw error;
        }
    }
    async verifyOtp(email: string, otp: string): Promise<any> {
        try {
            const user = await this.authRepository.findUserByEmail(email);
            if (user) throw new ConflictError("The email is already registered");
            const otpData = await Otp.findOne({ email: email });
            if (!otpData) throw new BadRequestError("Otp expired");
            if (otp !== otpData?.otp) throw new BadRequestError("The otp you entered is incorrect, Please enter a valid OTP");
            return { email, otp };
        } catch (error) {
            throw error;
        }
    }

    async getAllUsersBySameChapter(userId: string): Promise<any> {
        const user = await this.authRepository.findUserById(userId);
        const users = await this.authRepository.findAllUsersByChapterId(user?.chapterId);

        return users;
    }
}
