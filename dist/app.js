"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const authRoutes_1 = __importDefault(require("./api/v1/modules/user/auth/authRoutes"));
const errorHandler_1 = require("./middewares.ts/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const profileRoutes_1 = __importDefault(require("./api/v1/modules/user/profile/profileRoutes"));
const bodyLogger_1 = require("./middewares.ts/bodyLogger");
const dotenv_1 = __importDefault(require("dotenv"));
const corsConfig_1 = require("./config/corsConfig");
const authRoutes_2 = __importDefault(require("./api/v1/modules/admin/auth/authRoutes"));
const route_1 = __importDefault(require("./api/v1/modules/admin/nation/route"));
const chapterRoutes_1 = __importDefault(require("./api/v1/modules/admin/chapter/chapterRoutes"));
const regionRoutes_1 = __importDefault(require("./api/v1/modules/admin/region/regionRoutes"));
const localRoutes_1 = __importDefault(require("./api/v1/modules/admin/local/localRoutes"));
const eventRouter_1 = __importDefault(require("./api/v1/modules/admin/event/eventRouter"));
const eventRouter_2 = __importDefault(require("./api/v1/modules/user/event/eventRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, corsConfig_1.corsConfig)());
app.use((0, cookie_parser_1.default)());
app.use(bodyLogger_1.printBody);
// Version 1
const version = process.env.API_VERSION;
// User Routes
app.use(`/${version}/auth`, authRoutes_1.default);
app.use(`/${version}/profile`, profileRoutes_1.default);
app.use(`/${version}/events`, eventRouter_2.default);
// Admin Routes
app.use(`/${version}/admin/auth`, authRoutes_2.default);
app.use(`/${version}/admin/nation`, route_1.default);
app.use(`/${version}/admin/chapter`, chapterRoutes_1.default);
app.use(`/${version}/admin/region`, regionRoutes_1.default);
app.use(`/${version}/admin/local`, localRoutes_1.default);
app.use(`/${version}/admin/event`, eventRouter_1.default);
// Error handler
app.use(errorHandler_1.errorHandler);
exports.Server = http_1.default.createServer(app);
