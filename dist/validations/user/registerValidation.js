"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegistrationSchema = void 0;
const zod_1 = require("zod");
exports.userRegistrationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    phonenumber: zod_1.z
        .string()
        .regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" }),
    chapter: zod_1.z.string().min(1, { message: "Chapter is required" }),
});
// ✅ Example use
const result = exports.userRegistrationSchema.safeParse({
    name: "Adarsh",
    email: "adarsh@example.com",
    phoneNumber: "9876543210",
    chapter: "React Basics",
});
