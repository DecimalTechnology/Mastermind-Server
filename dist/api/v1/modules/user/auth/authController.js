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
exports.AuthController = void 0;
const customErrors_1 = require("../../../../../constants/customErrors");
const statusCodes_1 = require("../../../../../constants/statusCodes");
const registerValidation_1 = require("../../../../../validations/user/registerValidation");
const { OK, CREATED } = statusCodes_1.STATUS_CODES;
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    // @desc   New User Registration pwa
    // @route  POST v1/auth/register
    // @access User
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                registerValidation_1.userRegistrationSchema.parse(req.body);
                const response = yield this.authService.userRegistration(req.body);
                res.status(OK).json({
                    success: true,
                    message: "User registration successfull, You will get a password after admin verification",
                    data: response,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   New User login pwa
    // @route  POST v1/auth/signin
    // @access User
    userLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || Object.keys(req.body).length == 0)
                    throw new customErrors_1.EmptyRequestBodyError();
                const response = yield this.authService.userLogin(req.body);
                res.status(OK).json({ success: true, message: "User signin successfull", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Reset password
    // @route  POST v1/auth/password/reset
    // @access User
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || Object.keys(req.body).length == 0)
                    throw new customErrors_1.EmptyRequestBodyError();
                const response = yield this.authService.resetPassword(req.body.oldPassword, req.body.newPassword, req.userId);
                res.status(OK).json({ success: true, message: "Your password has been successfully reset", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Forget password
    // @route  POST v1/auth/password/forget
    // @access User
    forgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || Object.keys(req.body).length == 0)
                    throw new customErrors_1.EmptyRequestBodyError();
                const response = yield this.authService.forgetPassword(req.body.email, req.body.otp);
                res.status(OK).json({ success: true, message: "One time password has been sent to your email", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Updated new password while forgetting
    // @route  POST v1/auth/password/forget
    // @access User
    updateForgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || Object.keys(req.body).length == 0)
                    throw new customErrors_1.EmptyRequestBodyError();
                const response = yield this.authService.updateForgetPassword(req.body.email, req.body.password);
                res.status(OK).json({ success: true, message: "Your password has been updated successfully", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   To get all the nation list
    // @route  POST v1/auth/nations
    // @access User
    getAllNations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.authService.getAllNations();
                res.status(OK).json({ success: true, message: "", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   To get all the regions list
    // @route  POST v1/auth/regions
    // @access User
    getAllRegions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const nationId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.nationId;
                if (!nationId)
                    throw new customErrors_1.NotFoundError("Please provide region Id");
                const response = yield this.authService.getAllRegions(nationId);
                res.status(OK).json({ success: true, message: "", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   To get all the locals list
    // @route  POST v1/auth/locals
    // @access User
    getAllLocals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const regionId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.regionId;
                if (!regionId)
                    throw new customErrors_1.NotFoundError("Please provide regionId Id");
                const response = yield this.authService.getAllLocalsByRegionId(regionId);
                res.status(OK).json({ success: true, message: "", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   To get all the chapters list
    // @route  POST v1/auth/chapters
    // @access User
    getAllChapters(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const localId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.localId;
                if (!localId)
                    throw new customErrors_1.NotFoundError("Please provide local Id");
                const response = yield this.authService.getAllChaptersByLocalId(localId);
                res.status(OK).json({ success: true, message: "", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   To send otp to users email
    // @route  POST v1/auth/send-otp
    // @access User
    sendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email)
                    throw new customErrors_1.NotFoundError("Please provide email");
                const response = yield this.authService.sendOtp(email);
                res.status(OK).json({ success: true, message: "The email send successfully", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   To verify otp to users email
    // @route  POST v1/auth/verify-otp
    // @access User
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                if (!email)
                    throw new customErrors_1.NotFoundError("Please provide email");
                if (!otp)
                    throw new customErrors_1.NotFoundError("Please provide email");
                const response = yield this.authService.verifyOtp(email, otp);
                res.status(OK).json({ success: true, message: "The email send successfully", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Get all users
    // @route  GET v1/auth/chapter/users
    // @access User
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const response = yield this.authService.getAllUsersBySameChapter(userId);
                res.status(OK).json({ success: true, message: "", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
