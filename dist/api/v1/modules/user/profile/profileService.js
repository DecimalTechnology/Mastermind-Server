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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customErrors_1 = require("../../../../../constants/customErrors");
const uploadToCloudinary_1 = require("../../../../../utils/v1/cloudinary/uploadToCloudinary");
class ProfileService {
    constructor(profileRepository, chapterRepository) {
        this.profileRepository = profileRepository;
        this.chapterRepository = chapterRepository;
    }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const res = yield this.profileRepository.findProfileById(userId);
                if (!res)
                    throw new customErrors_1.NotFoundError("Profile details not found");
                const user = yield this.profileRepository.findUserById(userId);
                const chapter = yield this.chapterRepository.findChapter(user === null || user === void 0 ? void 0 : user.chapter);
                return Object.assign(Object.assign({}, res), { name: user === null || user === void 0 ? void 0 : user.name, chapter: chapter === null || chapter === void 0 ? void 0 : chapter.name, region: (_a = chapter === null || chapter === void 0 ? void 0 : chapter.regionId) === null || _a === void 0 ? void 0 : _a.name, nation: (_b = chapter === null || chapter === void 0 ? void 0 : chapter.nationId) === null || _b === void 0 ? void 0 : _b.name, local: (_c = chapter === null || chapter === void 0 ? void 0 : chapter.localId) === null || _c === void 0 ? void 0 : _c.name });
            }
            catch (error) {
                console.log("Error while fetching profile information");
                throw error;
            }
        });
    }
    updateProfile(profileData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const industries = profileData.industries.split(",");
                profileData.industries = industries;
                const { image } = profileData, newProfileData = __rest(profileData, ["image"]);
                return yield this.profileRepository.updateProfile(newProfileData, userId);
            }
            catch (error) {
                console.log("Error while updating profile");
                throw error;
            }
        });
    }
    updateProfilePicture(userId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const images = yield (0, uploadToCloudinary_1.uploadImageToCloudinary)(files);
                if (!(images === null || images === void 0 ? void 0 : images.success))
                    throw new customErrors_1.BadRequestError("Profile picture failed to update");
                const image = images === null || images === void 0 ? void 0 : images.results[0].url;
                const result = yield this.profileRepository.updateProfileImage(userId, image);
                if (!result)
                    throw new customErrors_1.BadRequestError("Something went wrong, Profile picture failed to update");
                return result;
            }
            catch (error) {
                console.log("Error while updating profile picture");
                throw error;
            }
        });
    }
    searchProfile(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.profileRepository.findUserBySearchQuery(query, userId);
            }
            catch (error) {
                console.log("Error while updating profile picture");
                throw error;
            }
        });
    }
    getProfileById(profileId, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const res = yield this.profileRepository.findProfileBy_id(profileId);
                if (!res)
                    throw new customErrors_1.NotFoundError("Profile not found");
                const receiverId = res === null || res === void 0 ? void 0 : res.userId.toString(); // Ensure receiverId is a string
                const senderId = currentUserId.toString(); // Ensure senderId is a string
                const connectionHistory = yield this.profileRepository.findAlreadyConnected(senderId);
                let connectionStatus = "not_connected"; // Default
                if (connectionHistory) {
                    const isConnected = (_a = connectionHistory === null || connectionHistory === void 0 ? void 0 : connectionHistory.connections) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === receiverId);
                    const isRequestSent = (_b = connectionHistory === null || connectionHistory === void 0 ? void 0 : connectionHistory.sentRequests) === null || _b === void 0 ? void 0 : _b.some((id) => id.toString() === receiverId);
                    const isRequestReceived = (_c = connectionHistory === null || connectionHistory === void 0 ? void 0 : connectionHistory.receiveRequests) === null || _c === void 0 ? void 0 : _c.some((id) => id.toString() === receiverId);
                    if (isConnected) {
                        connectionStatus = "connected";
                    }
                    else if (isRequestSent) {
                        connectionStatus = "request_sent";
                    }
                    else if (isRequestReceived) {
                        connectionStatus = "request_received";
                    }
                    else {
                        connectionStatus = "not_connected";
                    }
                }
                // Attach connection status to the profile response
                return Object.assign(Object.assign({}, res), { connectionStatus });
            }
            catch (error) {
                console.log("Error while while finding profie by _id");
                throw error;
            }
        });
    }
    connectUser(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.profileRepository.findConnectionsDataByArray([
                    new mongoose_1.default.Types.ObjectId(senderId),
                    new mongoose_1.default.Types.ObjectId(receiverId),
                ]);
                const senderDataIndex = connection.findIndex((obj) => (obj === null || obj === void 0 ? void 0 : obj.userId) == senderId);
                const receiverDataIndex = connection.findIndex((obj) => (obj === null || obj === void 0 ? void 0 : obj.userId) == receiverId);
                if (senderDataIndex < 0) {
                    const newConnectionData = {
                        userId: senderId,
                        connections: [],
                        sentRequests: [receiverId],
                        receiveRequests: [],
                    };
                    yield this.profileRepository.createConnection(newConnectionData);
                }
                if (receiverDataIndex < 0) {
                    const newConnectionData = {
                        userId: receiverId,
                        connections: [],
                        sentRequests: [],
                        receiveRequests: [senderId],
                    };
                    yield this.profileRepository.createConnection(newConnectionData);
                }
                yield this.profileRepository.addConnection(senderId, receiverId);
                return { connectionStatus: "request_sent" };
            }
            catch (error) {
                console.log("Error: connect user");
                throw error;
            }
        });
    }
    acceptConnection(userId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.profileRepository.acceptConnection(userId, senderId);
                return { connectionStatus: "connected" };
            }
            catch (error) {
                console.log("Error: accept connection ");
                throw error;
            }
        });
    }
    removeConnection(userId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.profileRepository.removeConnection(userId, senderId);
                return { connectionStatus: "not_connected" };
            }
            catch (error) {
                console.log("Error: remove connection");
                throw error;
            }
        });
    }
    cancelConnection(userId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.profileRepository.cancelConnection(userId, senderId);
                return { connectionStatus: "not_connected" };
            }
            catch (error) {
                console.log("Error: cancel connection");
                throw error;
            }
        });
    }
    getConnections(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.profileRepository.findConnectionByUserId(userId);
                if (!result)
                    throw new customErrors_1.NotFoundError("The required data not found ");
                return result;
            }
            catch (error) {
                console.log("Error: get connections");
                throw error;
            }
        });
    }
    getSendRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.profileRepository.findSendRequests(userId);
                if (!result)
                    throw new customErrors_1.NotFoundError("Sent request list not found");
                return result;
            }
            catch (error) {
                console.log("Error: get sent requests");
                throw error;
            }
        });
    }
    getReceiveRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.profileRepository.findReceiveRequests(userId);
                if (!result)
                    throw new customErrors_1.NotFoundError("Sent request list not found");
                return result;
            }
            catch (error) {
                console.log("Error: get sent requests");
                throw error;
            }
        });
    }
    getAllConnections(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.profileRepository.findAllConnections(userId);
                if (!result)
                    throw new customErrors_1.NotFoundError("Sent request list not found");
                return result;
            }
            catch (error) {
                console.log("Error: get sent requests");
                throw error;
            }
        });
    }
}
exports.ProfileService = ProfileService;
