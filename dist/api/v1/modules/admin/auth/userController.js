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
exports.UserController = void 0;
const statusCodes_1 = require("../../../../../constants/statusCodes");
const { OK } = statusCodes_1.STATUS_CODES;
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    // @desc   Get All Users
    // @route  GET v1/admin/users
    // @access Admin
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userService.getAllUsers();
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
                const response = yield this.userService.approveUser(req.query.userId);
                res === null || res === void 0 ? void 0 : res.status(OK).json({ success: true, message: "User verification successfull", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
