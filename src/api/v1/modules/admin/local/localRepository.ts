import { ILocal } from "../../../../../interfaces/models/ILocal";
import { IRegion } from "../../../../../interfaces/models/IRegion";
import { IUser } from "../../../../../interfaces/models/IUser";
import { Local } from "../../../../../models/localModel";
import { Region } from "../../../../../models/regionModel";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class LocalRepository extends BaseRepository<ILocal> {
    constructor() {
        super(Local);
    }

    async findAllUsersBySerachQuery(search: string): Promise<IUser[]> {
        return await User.aggregate([
            {
                $match: {
                    name: { $regex: search, $options: "i" },
                    role: "member",
                },
            },
        ]);
    }

    async findAllLocals(search: string, regionId: string): Promise<any> {
        const res = await Local.find({})
            .populate({ path: "nationId", select: "name" })
            .populate({ path: "regionId", select: "name" })
            .populate({ path: "createdAt", select: "name" });
        const region = await Region.findOne({ _id: regionId });
        return { region: region, local: res };
    }

    async findLocalData(id: string): Promise<ILocal | null> {
        return await Local.findOne({ _id: id })
            .populate({ path: "nationId", select: "name" })
            .populate({ path: "regionId", select: "name" })
            .populate({ path: "createdAt", select: "name" });
    }
}
