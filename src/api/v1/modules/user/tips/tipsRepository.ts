import { extend } from "joi";
import tipsModel, { ITips } from "../../../../../models/tipsModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class TipsRepository extends BaseRepository<ITips> {
    constructor() {
        super(tipsModel);
    }

    async findTodaysTip(): Promise<ITips[]> {
        const start = new Date();
        start.setHours(0, 0, 0, 0); // start of today

        const end = new Date();
        end.setHours(23, 59, 59, 999); // end of today

        const tips = await tipsModel.find({
            createdAt: { $gte: start, $lte: end },
            isActive: true, // optional: only active tips
        }).sort({ createdAt: -1 }); // optional: latest first

        return tips;
    }
}
