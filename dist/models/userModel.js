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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const common_1 = require("../enums/common");
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phonenumber: { type: Number, required: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(common_1.UserRole),
        required: true,
        default: common_1.UserRole.MEMBER,
    },
    // Where the user belongs
    // nation: { type: Schema.Types.ObjectId, ref: 'Nation', default: null },
    // region: { type: Schema.Types.ObjectId, ref: 'Region', default: null },
    chapter: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Chapter', },
    nation: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Nation', },
    region: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Region', },
    local: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Local', },
    // What the user manages
    manage: {
        type: Object,
        default: null, // or use {} if you prefer empty object
    },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true });
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
