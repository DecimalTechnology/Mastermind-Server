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
    constructor(Model) {
        this.Model = Model;
    }
    // Find
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Model.findById(id);
        });
    }
    searchBySearchQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Model.find({
                name: { $regex: query, $options: 'i' }
            });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Model.findOne({ email });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Model.find();
        });
    }
    // Delete
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Model.findByIdAndDelete(id);
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Model.deleteMany({});
        });
    }
    findByIdAndUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Model.findByIdAndUpdate(id, data, { new: true });
        });
    }
    // Add
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newData = new this.Model(data);
            yield newData.save();
            return newData;
        });
    }
}
exports.BaseRepository = BaseRepository;
