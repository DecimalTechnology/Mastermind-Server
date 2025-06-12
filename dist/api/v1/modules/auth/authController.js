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
const customErrors_1 = require("../../../../constants/customErrors");
const statusCodes_1 = require("../../../../constants/statusCodes");
const { OK } = statusCodes_1.STATUS_CODES;
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    // @desc   New User Registration pwa
    // @route  POST /auth/register  
    // @access Admin 
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || Object.keys(req.body).length == 0)
                    throw new customErrors_1.EmptyRequestBodyError();
                const response = yield this.authService.userRegistration(req.body);
                res.status(OK).json({ success: true, message: "User registration successfull", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
