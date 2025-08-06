"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.UserRepository = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userModel_1 = __importDefault(require("../../../../../models/userModel"));
const baseRepository_1 = require("./baseRepository");
const customErrors_1 = require("../../../../../constants/customErrors");
class UserRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(userModel_1.default);
    }
    updateCoreTeamData(coreTeams, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectIds = coreTeams.map((ids) => new mongoose_1.Types.ObjectId(ids));
            return yield userModel_1.default.updateMany({ _id: { $in: objectIds } }, { $set: data });
        });
    }
    findMembersByChapterId(chapterId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search = "", status } = query;
            const matchStage = {
                chapter: new mongoose_1.default.Types.ObjectId(chapterId),
            };
            if (search) {
                matchStage.name = { $regex: search, $options: "i" };
            }
            matchStage.role = "member";
            if (status === "Pending") {
                matchStage.isVerified = false;
            }
            else if (status === "Approved") {
                matchStage.isVerified = true;
                matchStage.isBlocked = false;
            }
            else if (status === "Blocked") {
                matchStage.isBlocked = true;
            }
            const pipeline = [{ $match: matchStage }, { $sort: { _id: -1 } }];
            const pendingCount = yield userModel_1.default.aggregate([{ $match: { chapter: new mongoose_1.default.Types.ObjectId(chapterId), isVerified: false } }]);
            const users = yield userModel_1.default.aggregate(pipeline);
            const totalPage = yield userModel_1.default.find({ chapter: chapterId });
            return { users: users, pendingCount: pendingCount.length, totalPage: totalPage };
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: true } }, { new: true });
            if (!user)
                throw new customErrors_1.NotFoundError("User not found with this Id");
            return user;
        });
    }
    unblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: false } }, { new: true });
            if (!user)
                throw new customErrors_1.NotFoundError("User not found with this Id");
            return user;
        });
    }
}
exports.UserRepository = UserRepository;
