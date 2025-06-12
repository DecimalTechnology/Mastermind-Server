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
const auth_1 = require("../../../../../validations/admin/auth");
const token_1 = require("../../../../../utils/v1/token/token");
const statusCodes_1 = require("../../../../../constants/statusCodes");
const { OK } = statusCodes_1.STATUS_CODES;
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    // @desc   Get All Users
    // @route  GET v1/admin/users
    // @access Admin
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.authService.getAllUsers();
                res === null || res === void 0 ? void 0 : res.status(OK).json({ success: true, data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Approve user registration request
    // @route  get v1/admin/user/approve
    // @access Admin
    approveUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.authService.approveUser(req.query.userId);
                res === null || res === void 0 ? void 0 : res.status(OK).json({ success: true, message: "User verification successfull", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   admin login
    // @route  get v1/admin/login
    // @access Admin
    adminLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = auth_1.loginSchema.parse(req.body);
                const response = yield this.authService.adminLogin(credentials);
                const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 1000;
                const REFRESH_TOKEN_MAX_AGE = 48 * 60 * 60 * 1000;
                res === null || res === void 0 ? void 0 : res.status(OK).cookie("mastermind_admin_access_token", response === null || response === void 0 ? void 0 : response.accessToken, { httpOnly: true, sameSite: "none", maxAge: ACCESS_TOKEN_MAX_AGE, secure: true }).cookie("mastermind_admin_refresh_token", response === null || response === void 0 ? void 0 : response.accessToken, { httpOnly: true, sameSite: "none", maxAge: REFRESH_TOKEN_MAX_AGE, secure: true }).json({ success: true, message: "Admin verification successfull", data: response === null || response === void 0 ? void 0 : response.adminData });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Refresh acess token
    // @route  get v1/admin/refresh-token
    // @access Admin
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.mastermind_admin_refresh_token;
                if (!refreshToken || !(0, token_1.verifyRefreshToken)(refreshToken))
                    throw new customErrors_1.UnAuthorizedError("Session expired. Please login again");
                const payload = (0, token_1.verifyRefreshToken)(refreshToken);
                if (!payload || Object.keys(payload).length !== 2)
                    throw new customErrors_1.UnAuthorizedError("Session expired. Please login again");
                const newAccesstoken = (0, token_1.generateAccessToken)(payload);
                res.status(OK).json({ success: true, message: "", data: { newAccesstoken } });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
