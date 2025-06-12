"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printBody = void 0;
const printBody = (req, res, next) => {
    if (Object.values(req.body).length > 0) {
        console.log(req.body);
    }
    next();
};
exports.printBody = printBody;
