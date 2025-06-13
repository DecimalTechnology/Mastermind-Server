"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Local = void 0;
const mongoose_1 = require("mongoose");
const localSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    nationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Nation' },
    regionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Region' },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true } // optional
}, { timestamps: true });
exports.Local = (0, mongoose_1.model)('Local', localSchema);
