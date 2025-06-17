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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const customErrors_1 = require("../../../../../constants/customErrors");
const messages_1 = require("../../../../../constants/messages");
const sendEmail_1 = require("../../../../../utils/v1/mail/sendEmail");
const password_1 = require("../../../../../utils/v1/password/password");
const token_1 = require("../../../../../utils/v1/token/token");
class AuthService {
    constructor(authRepository, nationRepository, regionRepository, localRepository, chapterRepository) {
        this.authRepository = authRepository;
        this.nationRepository = nationRepository;
        this.regionRepository = regionRepository;
        this.localRepository = localRepository;
        this.chapterRepository = chapterRepository;
    }
    userRegistration(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authRepository.findUserByEmail(userData === null || userData === void 0 ? void 0 : userData.email);
                if (user)
                    throw new customErrors_1.BadRequestError("User already registered");
                return yield this.authRepository.createUser(Object.assign(Object.assign({}, userData), { password: "" }));
            }
            catch (error) {
                console.log("User registration error");
                throw error;
            }
        });
    }
    userLogin(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authRepository.findUserByEmail(userData === null || userData === void 0 ? void 0 : userData.email);
                if (!user) {
                    throw new customErrors_1.BadRequestError("Invalid user");
                }
                // Check if the user is verified
                if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
                    throw new customErrors_1.BadRequestError("Your account is pending verification by an admin. Please wait until the verification is complete");
                }
                // Check if the user is blocked
                if (user === null || user === void 0 ? void 0 : user.isBlocked) {
                    throw new customErrors_1.BadRequestError("Your account has been blocked by the admin");
                }
                // Check if the password is valid
                const isPasswordValid = yield (0, password_1.comparePassword)(userData === null || userData === void 0 ? void 0 : userData.password, user === null || user === void 0 ? void 0 : user.password);
                if (!isPasswordValid) {
                    throw new customErrors_1.BadRequestError("Password you entered is incorrect");
                }
                // Generate tokens
                const accessToken = (0, token_1.generateAccessToken)(user === null || user === void 0 ? void 0 : user._id);
                const refreshToken = (0, token_1.generateRefreshToken)(user === null || user === void 0 ? void 0 : user._id);
                // Exclude the password field from the user object
                const { password } = user, newUser = __rest(user, ["password"]);
                // Return the user and tokens
                return { user: newUser, accessToken, refreshToken };
            }
            catch (error) {
                console.log("User login error");
                throw error;
            }
        });
    }
    resetPassword(oldPassword, newPassword, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authRepository.findOne(userId);
                if (!user)
                    throw new customErrors_1.NotFoundError("User not found");
                const compare = yield (0, password_1.comparePassword)(oldPassword, user === null || user === void 0 ? void 0 : user.password);
                if (!compare)
                    throw new customErrors_1.BadRequestError("The old password you enter is incorrect please provide a valid password");
                const hashedPassword = yield (0, password_1.hashPassword)(newPassword);
                const res = yield this.authRepository.updatePassword(hashedPassword, userId);
                if ((res === null || res === void 0 ? void 0 : res.modifiedCount) <= 0)
                    throw new customErrors_1.BadRequestError("Password updation failed");
                return "Password updated sucessfully";
            }
            catch (error) {
                throw error;
            }
        });
    }
    forgetPassword(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authRepository.findUserByEmail(email);
                if (!user)
                    throw new customErrors_1.BadRequestError("Invaild email address ");
                const message = (0, messages_1.forgetPasswordMessage)(otp);
                const isEmailSend = yield (0, sendEmail_1.sendLinkToEmail)(email, otp);
                if (!isEmailSend)
                    throw new customErrors_1.BadRequestError("Somthing went wrong while sending email to the user");
                return { email, otp };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateForgetPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authRepository.findUserByEmail(email);
                if (!user)
                    throw new customErrors_1.BadRequestError("No valid user found with this email ");
                if (!(user === null || user === void 0 ? void 0 : user.isVerified))
                    throw new customErrors_1.UnAuthorizedError("Your account is not verified by the admin");
                const samePassword = yield (0, password_1.comparePassword)(password, user === null || user === void 0 ? void 0 : user.password);
                const hashedPassword = yield (0, password_1.hashPassword)(password);
                if (samePassword)
                    throw new customErrors_1.BadRequestError("Your new password cannot be the same as your old password. Please choose a different password.");
                const res = yield this.authRepository.updatePassword(hashedPassword, user === null || user === void 0 ? void 0 : user._id);
                if ((res === null || res === void 0 ? void 0 : res.modifiedCount) > 0)
                    return;
                throw new customErrors_1.BadRequestError("Something went wrong password updation failed");
            }
            catch (error) {
                console.log("Error: forget password");
                throw error;
            }
        });
    }
    getAllNations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.nationRepository.findAll();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllRegions(nationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.regionRepository.findAllRegionsByNationId(nationId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllLocalsByRegionId(regionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.localRepository.findLocalsByRegionId(regionId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllChaptersByLocalId(localId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chapterRepository.findChaptersByLocalId(localId);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AuthService = AuthService;
