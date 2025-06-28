"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
const cors_1 = __importDefault(require("cors"));
const corsConfig = () => {
    return (0, cors_1.default)({
        origin: [
            "https://mastermind-registration-pwa.vercel.app",
            "http://localhost:5173",
            "http://127.0.0.1:5500"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    });
};
exports.corsConfig = corsConfig;
