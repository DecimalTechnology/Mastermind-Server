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
const customErrors_1 = require("../../../../constants/customErrors");
class AuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    userRegistration(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authRepository.findUserByEmail(userData === null || userData === void 0 ? void 0 : userData.email);
                if (user)
                    throw new customErrors_1.BadRequestError("User already registered");
                return yield this.authRepository.createUser(Object.assign(Object.assign({}, userData), { password: "" }));
                // const randomPassword = generateRandomPassword();
                // const hashedPassword = await hashPassword(randomPassword);
                // const newUserData = { ...userData, password: hashedPassword };
                // const newUser = await this.authRepository.createUser(newUserData);
                //         const credentialsObj = {
                //             userId: newUser?._id,
                //             password: hashedPassword,
                //         };
                //         const message = `
                //   Dear User,
                //   Welcome to MasterMind! 🎉
                //   Your sign-in credentials are as follows:
                //   Password: ${randomPassword}
                //   Please keep these details safe. For security reasons, we recommend changing your password after your first login.
                //   If you have any questions, feel free to contact our support team.
                //   Best regards,
                //   The MasterMind Team
                // `;
                //         const isSendMailSuccess = sendLinkToEmail(newUser?.email, message);
                //         if(!isSendMailSuccess){
                //              await this.authRepository.deleteUserById(newUser?._id);
                //              throw new BadRequestError("Something went wrong")
                //         }
                //             return newUser;
            }
            catch (error) {
                console.log("User registration error");
                throw error;
            }
        });
    }
}
exports.AuthService = AuthService;
