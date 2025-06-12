"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchema = void 0;
const zod_1 = require("zod");
// Define the Zod schema for the user
exports.userValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email format").min(1, "Email is required"),
    phonenumber: zod_1.z.number().int("Phone number must be a valid integer").min(1000000000, "Phone number must be 10 digits"),
    region: zod_1.z.string().min(1, "Region is required"),
    chapter: zod_1.z.string().min(1, "Chapter is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long").optional(), // Optional, depending on your needs
    isVerified: zod_1.z.boolean().optional(),
    isBlocked: zod_1.z.boolean().optional()
});
