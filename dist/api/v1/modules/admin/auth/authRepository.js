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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const profileModel_1 = __importDefault(require("../../../../../models/profileModel"));
const userModel_1 = __importDefault(require("../../../../../models/userModel"));
class AuthRepository {
    updateUserIsVerified(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.findOneAndUpdate({ _id: userId }, { $set: { isVerified: true, password: password } }, { new: true });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findOne({ email: email });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.find();
        });
    }
    findOne(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findOne({ _id: userId });
        });
    }
    createProfile(profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newProfile = new profileModel_1.default(profileData);
                yield newProfile.save();
                return new profileModel_1.default();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AuthRepository = AuthRepository;
