"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nation = void 0;
const mongoose_1 = require("mongoose");
const nationSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true } // optional
}, { timestamps: true });
exports.Nation = (0, mongoose_1.model)('Nation', nationSchema);
