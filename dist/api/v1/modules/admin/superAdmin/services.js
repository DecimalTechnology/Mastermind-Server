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
exports.SuperAdminService = void 0;
const common_1 = require("../../../../../enums/common");
class SuperAdminService {
    constructor(superAdminRepository, nationRepository, userRepository) {
        this.superAdminRepository = superAdminRepository;
        this.nationRepository = nationRepository;
        this.userRepository = userRepository;
    }
    // Search users
    searchUsers(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.superAdminRepository.findAllUser(search);
        });
    }
    // Create nation
    createNation(data, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const nationObj = {
                name: data === null || data === void 0 ? void 0 : data.name,
                createdBy: adminId,
            };
            const res = yield this.nationRepository.create(nationObj);
            const userUpdateObj = {
                manage: {
                    nation: res === null || res === void 0 ? void 0 : res._id
                },
                role: common_1.UserRole.NATIONAL_ADMIN
            };
            return yield this.userRepository.findByIdAndUpdate(data === null || data === void 0 ? void 0 : data.admin, userUpdateObj);
        });
    }
    // Find all nations
    searchNations(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.superAdminRepository.searchBySearchQuery(search);
        });
    }
}
exports.SuperAdminService = SuperAdminService;
