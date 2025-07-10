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
exports.ProfileController = void 0;
const statusCodes_1 = require("../../../../../constants/statusCodes");
const customErrors_1 = require("../../../../../constants/customErrors");
const { OK, CREATED } = statusCodes_1.STATUS_CODES;
class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    // @desc   Update profile details
    // @route  PUT v1/profile
    // @access User
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("hiii", req.body);
                if (!req.body || Object.keys(req.body).length == 0)
                    throw new customErrors_1.EmptyRequestBodyError();
                const result = yield this.profileService.updateProfile(req.body, req.userId);
                res.status(OK).json({ success: true, message: "Profile datas succesfully updated", data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Get all the profile info
    // @route  GET v1/profile
    // @access User
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.profileService.getProfile(req.userId);
                res.status(OK).json({ success: true, message: "User profile fetched successfully", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Update profile image
    // @route  PATCH v1/profile/profile-picture
    // @access User
    updateProfilePicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.profileService.updateProfilePicture(req.userId, req.files);
                res.status(OK).json({ success: true, message: "Profile picture updated successfully", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Search profile by query
    // @route  GET v1/profile/search
    // @access User
    searchProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, type, page } = req.query;
                const filter = Object.assign(Object.assign({}, req.body), { search, type, page });
                if (!req.query.search)
                    throw new customErrors_1.NotFoundError("Search query not provided");
                const response = yield this.profileService.searchProfile(filter, req.userId);
                res.status(OK).json({ success: true, message: "", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Get profile by profile _id
    // @route  GET v1/profile/:id
    // @access User
    getProfileById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.id)
                    throw new customErrors_1.NotFoundError("Invalid user Id");
                const response = yield this.profileService.getProfileById(req.params.id, req.userId);
                res.status(OK).json({ success: true, message: "", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Connect users
    // @route  POST v1/profile/connect
    // @access User
    connectUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.query.userId)
                    throw new customErrors_1.NotFoundError("Invalid user ID");
                const response = yield this.profileService.connectUser(req.userId, req.query.userId);
                res.status(OK).json({ success: true, message: "Connected successfully", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Get all connection
    // @route  GET v1/profile/connect/all
    // @access User
    getConnections(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.profileService.getConnections(req.userId);
                res.status(OK).json({ success: true, message: "", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Accept connection
    // @route  PATCH v1/profile/connect/accept
    // @access User
    acceptConnection(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.userId)
                    throw new customErrors_1.NotFoundError("Invalid user ID");
                const response = yield this.profileService.acceptConnection(req.userId, req.body.userId);
                res.status(OK).json({ success: true, message: "Connection request accepted successfully", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Remove connection
    // @route  PATCH v1/profile/connect/remove
    // @access User
    removeConnection(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.userId)
                    throw new customErrors_1.NotFoundError("Invalid user ID");
                const response = yield this.profileService.removeConnection(req.userId, req.body.userId);
                res.status(OK).json({ success: true, message: "Connection request removed successfully", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Cancel cancelConnection connection
    // @route  PATCH v1/profile/connect/cancel
    // @access User
    cancelConnection(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.userId)
                    throw new customErrors_1.NotFoundError("Invalid user ID");
                const response = yield this.profileService.cancelConnection(req.userId, req.body.userId);
                res.status(OK).json({ success: true, message: "Connection request cancelled successfully ", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Get all the list of sent requests
    // @route  GET v1/profile/connect/sent
    // @access User
    getSendRequests(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.profileService.getSendRequests(req.userId);
                res.status(OK).json({ success: true, message: " ", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Get the list of receive requests
    // @route  GET v1/profile/connect/received
    // @access User
    getReceiveRequests(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.profileService.getReceiveRequests(req.userId);
                res.status(OK).json({ success: true, message: " ", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Get all connection for the current user
    // @route  GET v1/profile/connect/connections
    // @access User
    getAllConnections(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.profileService.getAllConnections(req.userId);
                res.status(OK).json({ success: true, message: " ", data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProfileController = ProfileController;
