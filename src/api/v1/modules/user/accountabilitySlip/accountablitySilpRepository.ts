import mongoose from "mongoose";
import { IAccountablity } from "../../../../../interfaces/models/IAccountablity";
import AccountablitySlip from "../../../../../models/accountabilitySlip";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class AccountablityRepository extends BaseRepository<IAccountablity> {
    constructor() {
        super(AccountablitySlip);
    }

    async findAllAccountability(userId: string): Promise<IAccountablity[]> {

        return await AccountablitySlip.aggregate([{$match:{userId:new mongoose.Types.ObjectId(userId)}}])
    }
}
