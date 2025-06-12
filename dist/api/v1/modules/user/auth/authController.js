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
                console.log('called');
                // userValidationSchema.parse(req.body)
                const response = yield this.authService.userRegistration(req.body);
                res.status(OK).json({ success: true, message: "User registration successfull", data: response });
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
    // @access Admin 
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
    // @access Admin 
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
}
exports.AuthController = AuthController;
