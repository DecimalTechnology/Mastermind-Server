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
exports.UserService = void 0;
const customErrors_1 = require("../../../../constants/customErrors");
const sendEmail_1 = require("../../../../utils/v1/mail/sendEmail");
const generateRandomPassword_1 = require("../../../../utils/v1/password/generateRandomPassword");
const password_1 = require("../../../../utils/v1/password/password");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findAll();
            }
            catch (error) {
                throw error;
            }
        });
    }
    approveUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findOne(userId);
                if (!user)
                    throw new customErrors_1.NotFoundError("User not found ");
                const password = (0, generateRandomPassword_1.generateRandomPassword)();
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
                const isMailSend = yield (0, sendEmail_1.sendLinkToEmail)(user === null || user === void 0 ? void 0 : user.email, message);
                if (!isMailSend)
                    throw new customErrors_1.BadRequestError("Something went wrong while sending the password to your registered email");
                const hashedPassword = yield (0, password_1.hashPassword)(password);
                const profileData = {
                    userId: user === null || user === void 0 ? void 0 : user._id,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    phoneNumbers: [user === null || user === void 0 ? void 0 : user.phonenumber],
                };
                yield this.userRepository.createProfile(profileData);
                return yield this.userRepository.updateUserIsVerified(userId, hashedPassword);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserService = UserService;
