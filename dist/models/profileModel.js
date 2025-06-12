"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profileSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'users' },
    company: { type: String, default: '' },
    image: { type: String, default: '' },
    about: { type: String, default: '' },
    dob: { type: String, default: '' },
    industries: { type: Array, default: [] },
    phoneNumbers: { type: Array, default: [] },
    email: { type: String, default: '' },
    googleMapLocation: { type: String, default: '' },
    website: { type: String, default: '' },
    socialMediaLinks: { type: Object, default: {} },
    memberSince: { type: String, default: '' }
}, { timestamps: true });
const Profile = mongoose_1.default.model('Profile', profileSchema);
exports.default = Profile;
