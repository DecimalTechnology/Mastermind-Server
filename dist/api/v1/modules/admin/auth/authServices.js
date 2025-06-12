"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const customErrors_1 = require("../../../../../constants/customErrors");
const sendEmail_1 = require("../../../../../utils/v1/mail/sendEmail");
const generateRandomPassword_1 = require("../../../../../utils/v1/password/generateRandomPassword");
const password_1 = require("../../../../../utils/v1/password/password");
const token_1 = require("../../../../../utils/v1/token/token");
class AuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    // Get all users from the database
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.authRepository.findAll();
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Approve a user and send them their login password
    approveUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the user by ID
                const user = yield this.authRepository.findOne(userId);
                if (!user)
                    throw new customErrors_1.NotFoundError("User not found");
                // Generate a random password
                const password = (0, generateRandomPassword_1.generateRandomPassword)();
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
                // Send the email to the user
                const isMailSend = yield (0, sendEmail_1.sendLinkToEmail)(user.email, message);
                if (!isMailSend)
                    throw new customErrors_1.BadRequestError("Failed to send password to email");
                // Hash the password
                const hashedPassword = yield (0, password_1.hashPassword)(password);
                // Create user profile
                const profileData = {
                    userId: user._id,
                    email: user.email,
                    phoneNumbers: [user.phonenumber],
                };
                yield this.authRepository.createProfile(profileData);
                // Mark user as verified and update password
                return yield this.authRepository.updateUserIsVerified(userId, hashedPassword);
            }
            catch (error) {
                throw error;
            }
        });
    }
    // To verify and provide access to the admin
    adminLogin(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            try {
                const admin = yield this.authRepository.findByEmail(email);
                if (!admin)
                    throw new customErrors_1.UnAuthorizedError("Invalid email or password");
                const isPasswordValid = yield (0, password_1.comparePassword)(password, admin.password);
                if (!isPasswordValid)
                    throw new customErrors_1.UnAuthorizedError("Invalid email or password");
                const accessToken = (0, token_1.generateAccessToken)({ userId: admin === null || admin === void 0 ? void 0 : admin._id, role: admin === null || admin === void 0 ? void 0 : admin.role });
                const refreshToken = (0, token_1.generateRefreshToken)({ userId: admin === null || admin === void 0 ? void 0 : admin._id, role: admin === null || admin === void 0 ? void 0 : admin.role });
                admin.password = null;
                return { adminData: admin, accessToken, refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AuthService = AuthService;
