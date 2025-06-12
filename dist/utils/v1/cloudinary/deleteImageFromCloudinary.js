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
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
const cloudinary_1 = __importDefault(require("./cloudinary"));
function deleteImageFromCloudinary(imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            // Extract the part after "/upload/"
            const parts = (_b = (_a = imageUrl.split("/upload/")[1]) === null || _a === void 0 ? void 0 : _a.split("/")) !== null && _b !== void 0 ? _b : [];
            if (parts.length === 0) {
                throw new Error("Invalid Cloudinary URL");
            }
            // Check if the first part is a version number (e.g., v1740728694)
            if (parts[0].startsWith("v") && !isNaN(Number(parts[0].substring(1)))) {
                parts.shift(); // Remove version number
            }
            // Join remaining parts to get the public ID and remove file extension
            const publicId = parts.join("/").replace(/\.[^/.]+$/, "");
            // Delete the image from Cloudinary
            const result = yield cloudinary_1.default.uploader.destroy(publicId);
            if (result.result === "ok") {
                console.log(`Image deleted successfully: ${publicId}`);
            }
            else {
                console.log(`Failed to delete image: ${publicId}`);
            }
        }
        catch (error) {
            console.error("Error deleting image:", error);
        }
    });
}
