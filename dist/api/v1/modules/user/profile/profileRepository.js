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
exports.ProfileRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customErrors_1 = require("../../../../../constants/customErrors");
const profileModel_1 = __importDefault(require("../../../../../models/profileModel"));
const userModel_1 = __importDefault(require("../../../../../models/userModel"));
const deleteImageFromCloudinary_1 = require("../../../../../utils/v1/cloudinary/deleteImageFromCloudinary");
const connectionModel_1 = __importDefault(require("../../../../../models/connectionModel"));
class ProfileRepository {
    findProfileById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield profileModel_1.default.findOne({ userId: userId }).lean();
            }
            catch (error) {
                throw error;
            }
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (userModel_1.default === null || userModel_1.default === void 0 ? void 0 : userModel_1.default.findOne({ _id: userId }).lean());
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateProfile(userId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (profileData === null || profileData === void 0 ? void 0 : profileData.name) {
                    yield userModel_1.default.findByIdAndUpdate(userId, { name: profileData === null || profileData === void 0 ? void 0 : profileData.name });
                }
                return yield (profileModel_1.default === null || profileModel_1.default === void 0 ? void 0 : profileModel_1.default.findOneAndUpdate({ userId: userId }, profileData, { new: true }));
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateProfileImage(userId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield profileModel_1.default.findOne({ userId: userId });
                if (user)
                    yield (0, deleteImageFromCloudinary_1.deleteImageFromCloudinary)(user === null || user === void 0 ? void 0 : user.image);
                return yield (profileModel_1.default === null || profileModel_1.default === void 0 ? void 0 : profileModel_1.default.findOneAndUpdate({ userId: userId }, { $set: { image: image } }, { new: true }));
            }
            catch (error) {
                console.log("Error while finding user by Id in the profile repository");
                throw error;
            }
        });
    }
    findUserBySearchQuery(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, company, googleMapLocation, page, type } = query;
                const user = yield userModel_1.default.findById(userId);
                const chapterId = user === null || user === void 0 ? void 0 : user.chapter;
                const matchStage = {};
                matchStage.name = { $regex: search, $options: "i" };
                matchStage["_id"] = { $ne: new mongoose_1.default.Types.ObjectId(userId) };
                type == "chapter" ? (matchStage.chapter = new mongoose_1.default.Types.ObjectId(chapterId)) : "";
                const filterMatchStage = {};
                company ? (filterMatchStage["profileData.company"] = company) : "";
                googleMapLocation ? (filterMatchStage["profileData.googleMapLocation"] = googleMapLocation) : "";
                const result = yield userModel_1.default.aggregate([
                    {
                        $match: {
                            name: { $regex: search, $options: "i" },
                        },
                    },
                    {
                        $match: matchStage,
                    },
                    {
                        $lookup: {
                            from: "profiles", // Collection name
                            localField: "_id", // User `_id`
                            foreignField: "userId", // Profile's `userId`
                            as: "profileData",
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            image: { $arrayElemAt: ["$profileData.image", 0] },
                            profileId: { $arrayElemAt: ["$profileData._id", 0] },
                            company: { $arrayElemAt: ["$profileData.company", 0] },
                            googleMapLocation: { $arrayElemAt: ["$profileData.googleMapLocation", 0] },
                        },
                    },
                    { $match: filterMatchStage },
                    {
                        $project: {
                            googleMapLocation: 0,
                        },
                    },
                ]);
                return result;
            }
            catch (error) {
                console.log("Error while finding user by Id in the profile repository");
                throw error;
            }
        });
    }
    findProfileBy_id(profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield profileModel_1.default.aggregate([
                    {
                        $match: { _id: new mongoose_1.default.Types.ObjectId(profileId) },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userData",
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            userId: { $arrayElemAt: ["$userData._id", 0] },
                            name: { $arrayElemAt: ["$userData.name", 0] },
                            chapter: { $arrayElemAt: ["$userData.chapter", 0] },
                            region: { $arrayElemAt: ["$userData.region", 0] },
                            image: 1,
                            company: 1,
                            about: 1,
                            dob: 1,
                            phoneNumbers: 1,
                            googleMapLocation: 1,
                            website: 1,
                            memberSince: 1,
                            email: 1,
                            industries: 1,
                            socialMediaLinks: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        },
                    },
                ]);
                return res[0];
            }
            catch (error) {
                console.log("Error finding profile by Id");
                throw error;
            }
        });
    }
    findConnectionById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield connectionModel_1.default.findOne({ userId: userId });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findConnectionsDataByArray(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield connectionModel_1.default.find({ userId: data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    createConnection(connectionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newConnection = new connectionModel_1.default(connectionData);
                yield newConnection.save();
                return newConnection;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addConnection(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return connectionModel_1.default.bulkWrite([
                    {
                        updateOne: {
                            filter: { userId: senderId },
                            update: { $addToSet: { sentRequests: receiverId } }, // Add receiverId to sentRequests array
                        },
                    },
                    {
                        updateOne: {
                            filter: { userId: receiverId }, // Find the receiver
                            update: { $addToSet: { receiveRequests: senderId } }, // Add senderId to receiveRequests array
                        },
                    },
                ]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAlreadyConnected(senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield connectionModel_1.default.findOne({ userId: senderId });
            }
            catch (error) {
                throw error;
            }
        });
    }
    acceptConnection(userId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield connectionModel_1.default.bulkWrite([
                    {
                        updateOne: {
                            filter: { userId: new mongoose_1.default.Types.ObjectId(userId) },
                            update: { $addToSet: { connections: new mongoose_1.default.Types.ObjectId(senderId) } }, // Add sender to connections
                        },
                    },
                    {
                        updateOne: {
                            filter: { userId: new mongoose_1.default.Types.ObjectId(senderId) },
                            update: { $addToSet: { connections: new mongoose_1.default.Types.ObjectId(userId) } }, // Add receiver to sender's connections
                        },
                    },
                    {
                        updateOne: {
                            filter: { userId: new mongoose_1.default.Types.ObjectId(userId) },
                            update: { $pull: { receiveRequests: new mongoose_1.default.Types.ObjectId(senderId) } }, // Remove senderId from receiver's receiveRequests
                        },
                    },
                    {
                        updateOne: {
                            filter: { userId: new mongoose_1.default.Types.ObjectId(senderId) },
                            update: { $pull: { sentRequests: new mongoose_1.default.Types.ObjectId(userId) } }, // Remove receiverId from sender's sentRequests
                        },
                    },
                ]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    removeConnection(userId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connectionModel_1.default.bulkWrite([
                    {
                        updateOne: {
                            filter: { userId: new mongoose_1.default.Types.ObjectId(userId) },
                            update: { $pull: { connections: new mongoose_1.default.Types.ObjectId(senderId) } },
                        },
                    },
                    {
                        updateOne: {
                            filter: { userId: new mongoose_1.default.Types.ObjectId(senderId) },
                            update: { $pull: { connections: new mongoose_1.default.Types.ObjectId(userId) } },
                        },
                    },
                ]);
                if (result.modifiedCount <= 0)
                    throw new customErrors_1.NotFoundError("Failed to disconnect user");
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    cancelConnection(userId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connectionModel_1.default.bulkWrite([
                    {
                        updateOne: {
                            filter: { userId: new mongoose_1.default.Types.ObjectId(userId) },
                            update: { $pull: { sentRequests: new mongoose_1.default.Types.ObjectId(senderId) } },
                        },
                    },
                    {
                        updateOne: {
                            filter: { userId: new mongoose_1.default.Types.ObjectId(senderId) },
                            update: { $pull: { receiveRequests: new mongoose_1.default.Types.ObjectId(userId) } },
                        },
                    },
                ]);
                if (result.modifiedCount <= 0)
                    throw new customErrors_1.NotFoundError("Failed to disconnect user");
                return { connectionStatus: "not_connected" };
            }
            catch (error) {
                throw error;
            }
        });
    }
    findConnectionByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield connectionModel_1.default.aggregate([
                    { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
                    {
                        $project: {
                            _id: 0,
                            connections: { $size: "$connections" },
                            sentRequests: { $size: "$sentRequests" },
                            receiveRequests: { $size: "$receiveRequests" },
                        },
                    },
                ]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    findSendRequests(senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userConnections = yield connectionModel_1.default.aggregate([
                    {
                        $match: { userId: new mongoose_1.default.Types.ObjectId(senderId) },
                    },
                    {
                        $unwind: "$sentRequests",
                    },
                    {
                        $project: { sentRequests: 1, _id: 0 },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "sentRequests",
                            foreignField: "_id",
                            as: "userData",
                        },
                    },
                    {
                        $unwind: "$userData",
                    },
                    {
                        $project: { "userData.name": 1, "userData._id": 1 },
                    },
                    {
                        $replaceRoot: { newRoot: "$userData" },
                    },
                    {
                        $lookup: {
                            from: "profiles",
                            localField: "_id",
                            foreignField: "userId",
                            as: "profileData",
                        },
                    },
                    {
                        $unwind: { path: "$profileData", preserveNullAndEmptyArrays: true }, // Ensures users without a profile are included
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            image: "$profileData.image",
                            company: "$profileData.company",
                            profileId: "$profileData._id",
                        },
                    },
                ]);
                return userConnections;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findReceiveRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userConnections = yield connectionModel_1.default.aggregate([
                    {
                        $match: { userId: new mongoose_1.default.Types.ObjectId(userId) },
                    },
                    {
                        $unwind: "$receiveRequests",
                    },
                    {
                        $project: { receiveRequests: 1, _id: 0 },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "receiveRequests",
                            foreignField: "_id",
                            as: "userData",
                        },
                    },
                    {
                        $unwind: "$userData",
                    },
                    {
                        $project: { "userData.name": 1, "userData._id": 1 },
                    },
                    {
                        $replaceRoot: { newRoot: "$userData" },
                    },
                    {
                        $lookup: {
                            from: "profiles",
                            localField: "_id",
                            foreignField: "userId",
                            as: "profileData",
                        },
                    },
                    {
                        $unwind: { path: "$profileData", preserveNullAndEmptyArrays: true }, // Ensures users without a profile are included
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            image: "$profileData.image",
                            company: "$profileData.company",
                            profileId: "$profileData._id",
                        },
                    },
                ]);
                return userConnections;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAllConnections(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userConnections = yield connectionModel_1.default.aggregate([
                    {
                        $match: { userId: new mongoose_1.default.Types.ObjectId(userId) },
                    },
                    {
                        $unwind: "$connections",
                    },
                    {
                        $project: { connections: 1, _id: 0 },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "connections",
                            foreignField: "_id",
                            as: "userData",
                        },
                    },
                    {
                        $unwind: "$userData",
                    },
                    {
                        $project: { "userData.name": 1, "userData._id": 1 },
                    },
                    {
                        $replaceRoot: { newRoot: "$userData" },
                    },
                    {
                        $lookup: {
                            from: "profiles",
                            localField: "_id",
                            foreignField: "userId",
                            as: "profileData",
                        },
                    },
                    {
                        $unwind: { path: "$profileData", preserveNullAndEmptyArrays: true }, // Ensures users without a profile are included
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            image: "$profileData.image",
                            company: "$profileData.company",
                            profileId: "$profileData._id",
                        },
                    },
                ]);
                return userConnections;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findProfileByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield profileModel_1.default.findOne({ userId: userId });
        });
    }
}
exports.ProfileRepository = ProfileRepository;
