import { INation } from "../../../../../interfaces/models/INation";
import { Nation } from "../../../../../models/nationModel";

import { BaseRepository } from "./baseRepository";

export class NationRepository extends BaseRepository<INation> {
    constructor() {
        super(Nation);
    }
}
