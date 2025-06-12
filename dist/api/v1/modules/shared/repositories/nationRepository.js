"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NationRepository = void 0;
const nationModel_1 = require("../../../../../models/nationModel");
const baseRepository_1 = require("./baseRepository");
class NationRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(nationModel_1.Nation);
    }
}
exports.NationRepository = NationRepository;
