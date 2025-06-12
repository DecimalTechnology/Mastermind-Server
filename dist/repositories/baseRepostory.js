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
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(email);
            return this.model.findOne({ email: email });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find({});
        });
    }
    findOne(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne({ _id: userId });
        });
    }
    deleteById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.deleteOne({ _id: userId });
        });
    }
    changeStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate({ id }, { isActive: { $not: "$isActive" } }, { new: true });
        });
    }
}
exports.BaseRepository = BaseRepository;
