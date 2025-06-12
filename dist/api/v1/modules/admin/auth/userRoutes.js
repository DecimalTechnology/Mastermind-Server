"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRepository_1 = require("./authRepository");
const userServices_1 = require("./userServices");
const authController_1 = require("./authController");
const userRouter = express_1.default.Router();
const userRepository = new authRepository_1.UserRepository();
const userService = new userServices_1.UserService(userRepository);
const controller = new authController_1.UserController(userService);
userRouter.get("/users", (req, res, next) => controller.getAllUsers(req, res, next));
userRouter.patch("/user/approve", (req, res, next) => controller.approveUser(req, res, next));
exports.default = userRouter;
