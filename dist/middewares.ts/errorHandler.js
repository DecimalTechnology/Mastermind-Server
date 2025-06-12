"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod"); // Import Zod for error type checking
const errorHandler = (err, req, res, next) => {
    let statusCode = err.status || 500;
    let message = err.message || "Internal Server Error";
    // Handle Mongoose validation errors
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((error) => `${error.path} is required.`)
            .join(", ");
    }
    // Handle Mongoose cast errors (e.g., invalid ObjectId format)
    else if (err instanceof mongoose_1.default.Error.CastError) {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }
    // Handle MongoDB duplicate key errors (e.g., unique constraint violations)
    else if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for '${field}': ${err.keyValue[field]}`;
    }
    // Handle Zod validation errors
    else if (err instanceof zod_1.z.ZodError) {
        statusCode = 400;
        message = err.errors
            .map((e) => `${e.path.join(' > ')}: ${e.message}`) // Format Zod errors
            .join(", ");
    }
    console.error(`\x1b[31m${message}\x1b[0m`);
    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.errorHandler = errorHandler;
