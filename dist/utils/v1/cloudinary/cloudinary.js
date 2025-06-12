"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// Configure your Cloudinary credentials
cloudinary_1.v2.config({
    cloud_name: `duzkgmph5`,
    api_key: `177817343463594`,
    api_secret: `khmggOP-sZFY70vlfvoJRynk0Bk`,
});
exports.default = cloudinary_1.v2;
