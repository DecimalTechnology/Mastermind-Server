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
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const corsConfig_1 = require("./config/corsConfig");
const authRoutes_2 = __importDefault(require("./api/v1/modules/admin/auth/authRoutes"));
const route_1 = __importDefault(require("./api/v1/modules/admin/nation/route"));
const chapterRoutes_1 = __importDefault(require("./api/v1/modules/admin/chapter/chapterRoutes"));
const regionRoutes_1 = __importDefault(require("./api/v1/modules/admin/region/regionRoutes"));
const localRoutes_1 = __importDefault(require("./api/v1/modules/admin/local/localRoutes"));
const eventRouter_1 = __importDefault(require("./api/v1/modules/admin/event/eventRouter"));
const eventRouter_2 = __importDefault(require("./api/v1/modules/user/event/eventRouter"));
const testimonialRoutes_1 = __importDefault(require("./api/v1/modules/user/testimonial/testimonialRoutes"));
const TYCBRoutes_1 = __importDefault(require("./api/v1/modules/user/TYCB/TYCBRoutes"));
const accountablitySlipRouter_1 = __importDefault(require("./api/v1/modules/user/accountabilitySlip/accountablitySlipRouter"));
const memberRoutes_1 = __importDefault(require("./api/v1/modules/admin/member/memberRoutes"));
const visionBoardRouter_1 = __importDefault(require("./api/v1/modules/user/visionBoard/visionBoardRouter"));
const tipsRoutes_1 = __importDefault(require("./api/v1/modules/admin/tips/tipsRoutes"));
const tipsRouter_1 = __importDefault(require("./api/v1/modules/user/tips/tipsRouter"));
const discountRouter_1 = __importDefault(require("./api/v1/modules/admin/discount/discountRouter"));
const discountRouter_2 = __importDefault(require("./api/v1/modules/user/discount/discountRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, corsConfig_1.corsConfig)());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
// app.use(printBody)
// Version 1
const version = process.env.API_VERSION;
// User Routes
app.use(`/${version}/auth`, authRoutes_1.default);
app.use(`/${version}/profile`, profileRoutes_1.default);
app.use(`/${version}/events`, eventRouter_2.default);
app.use(`/${version}/testimonial`, testimonialRoutes_1.default);
app.use(`/${version}/tycb`, TYCBRoutes_1.default);
app.use(`/${version}/accountability`, accountablitySlipRouter_1.default);
app.use(`/${version}/visionboard`, visionBoardRouter_1.default);
app.use(`/${version}/tips`, tipsRouter_1.default);
app.use(`/${version}/discounts`, discountRouter_2.default);
// Admin Routes
app.use(`/${version}/admin/auth`, authRoutes_2.default);
app.use(`/${version}/admin/nation`, route_1.default);
app.use(`/${version}/admin/chapter`, chapterRoutes_1.default);
app.use(`/${version}/admin/region`, regionRoutes_1.default);
app.use(`/${version}/admin/local`, localRoutes_1.default);
app.use(`/${version}/admin/event`, eventRouter_1.default);
app.use(`/${version}/admin/member`, memberRoutes_1.default);
app.use(`/${version}/admin/tips`, tipsRoutes_1.default);
app.use(`/${version}/admin/discounts`, discountRouter_1.default);
// Error handler
app.use(errorHandler_1.errorHandler);
exports.Server = http_1.default.createServer(app);
