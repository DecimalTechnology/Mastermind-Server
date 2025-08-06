"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRepository_1 = require("./authRepository");
const authServices_1 = require("./authServices");
const authController_1 = require("./authController");
const profileRepository_1 = require("../../user/profile/profileRepository");
const authRouter = express_1.default.Router();
const authRepository = new authRepository_1.AuthRepository();
const profileRepository = new profileRepository_1.ProfileRepository();
const authService = new authServices_1.AuthService(authRepository, profileRepository);
const controller = new authController_1.AuthController(authService);
authRouter.post("/login", (req, res, next) => controller.adminLogin(req, res, next));
authRouter.post("/refresh_token", (req, res, next) => controller.refreshToken(req, res, next));
authRouter.get("/users", (req, res, next) => controller.getAllUsers(req, res, next));
authRouter.get("/users", (req, res, next) => controller.getAllUsers(req, res, next));
authRouter.patch("/user/approve", (req, res, next) => controller.approveUser(req, res, next));
// Chapter Routes
exports.default = authRouter;
