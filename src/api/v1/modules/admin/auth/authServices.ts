import { BadRequestError, NotFoundError, UnAuthorizedError } from "../../../../../constants/customErrors";
import { UserRole } from "../../../../../enums/common";
import { IUser } from "../../../../../interfaces/models/IUser";
import { generateEmailHtml } from "../../../../../utils/v1/mail/htmlGenerator";
import { sendLinkToEmail } from "../../../../../utils/v1/mail/sendEmail";
import { generateRandomPassword } from "../../../../../utils/v1/password/generateRandomPassword";
import { comparePassword, hashPassword } from "../../../../../utils/v1/password/password";
import { generateAccessToken, generateRefreshToken } from "../../../../../utils/v1/token/token";
import { AuthRepository } from "./authRepository";

export class AuthService {
    constructor(private authRepository: AuthRepository) {}

    // Get all users from the database
    async getAllUsers(): Promise<IUser[] | null> {
        try {
            return await this.authRepository.findAll();
        } catch (error) {
            throw error;
        }
    }

    // Approve a user and send them their login password
    async approveUser(userId: string): Promise<IUser | null> {
        try {
            // Find the user by ID
            const user = await this.authRepository.findOne(userId);
            if (!user) throw new NotFoundError("User not found");

            // Generate a random password
            const password = generateRandomPassword();

            // Email content with the password
            const message = `
      Dear User,

      Welcome to MasterMind! 🎉

      Your sign-in credentials are as follows:

      Password: ${password}

      Please keep these details safe. For security reasons, we recommend changing your password after your first login.

      If you have any questions, feel free to contact our support team.

      Best regards,
      The MasterMind Team
    `;
            const html = generateEmailHtml(user?.name, password);

            // Send the email to the user
            const isMailSend = await sendLinkToEmail(user.email, "", html);
            if (!isMailSend) throw new BadRequestError("Failed to send password to email");

            // Hash the password
            const hashedPassword = await hashPassword(password);

            // Create user profile
            const profileData = {
                userId: user._id,
                email: user.email,
                phoneNumbers: [user.phonenumber],
            };
            await this.authRepository.createProfile(profileData);

            // Mark user as verified and update password
            return await this.authRepository.updateUserIsVerified(userId, hashedPassword);
        } catch (error) {
            throw error;
        }
    }

    // To verify and provide access to the admin
    async adminLogin({ email, password }: { email: string; password: string }): Promise<any> {
        try {
            const admin = await this.authRepository.findByEmail(email);
            if (admin?.role == "member") throw new UnAuthorizedError("Permission denied. No admin roles found");
            if (!admin) throw new UnAuthorizedError("Invalid email or password");
            const isPasswordValid = await comparePassword(password, admin.password);

            if (!isPasswordValid) throw new UnAuthorizedError("Invalid email or password");

            const accessToken = generateAccessToken({ userId: admin?._id, role: admin?.role });
            const refreshToken = generateRefreshToken({ userId: admin?._id, role: admin?.role });
            admin.password = null;

            const adminData = await this.authRepository.findAdmin(admin?._id, admin?.role);
            console.log(adminData, "", admin);
            return { adminData: adminData[0], accessToken, refreshToken };
        } catch (error) {
            throw error;
        }
    }
}
