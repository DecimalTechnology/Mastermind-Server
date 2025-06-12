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
exports.SuperAdminController = void 0;
const customErrors_1 = require("../../../../../constants/customErrors");
const statusCodes_1 = require("../../../../../constants/statusCodes");
const { OK } = statusCodes_1.STATUS_CODES;
class SuperAdminController {
    constructor(superAdminService) {
        this.superAdminService = superAdminService;
    }
    // @desc   Create new nation
    // @route  POST v1/superadmin/nation
    // @access Super admin
    createNation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.body.name || !((_a = req.body) === null || _a === void 0 ? void 0 : _a.admin))
                throw new customErrors_1.NotFoundError("Nation name is required");
            const result = yield this.superAdminService.createNation(req.body, req.adminId);
            res.status(OK).json({
                success: true,
                message: "New nation created successfully",
            });
        });
    }
    // @desc   Create new nation
    // @route  POST v1/superadmin/nation
    // @access Super admin
    findUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.superAdminService.searchUsers(req.query.search);
            res.status(OK).json({
                success: true,
                message: "New nation created successfully",
                data: result,
            });
        });
    }
    // @desc   Find all nations
    // @route  GET v1/superadmin/nations
    // @access Super admin
    getAllNations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.superAdminService.searchNations(req.query.search);
            res.status(OK).json({
                success: true,
                message: "",
                data: result,
            });
        });
    }
}
exports.SuperAdminController = SuperAdminController;
