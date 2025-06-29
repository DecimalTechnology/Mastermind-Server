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
exports.UserRepository = void 0;
const mongoose_1 = require("mongoose");
const userModel_1 = __importDefault(require("../../../../../models/userModel"));
const baseRepository_1 = require("./baseRepository");
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
}
exports.UserRepository = UserRepository;
