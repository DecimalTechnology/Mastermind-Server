"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Region = void 0;
const mongoose_1 = require("mongoose");
const regionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    nationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Nation' },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true } // optional
}, { timestamps: true });
exports.Region = (0, mongoose_1.model)('Region', regionSchema);
