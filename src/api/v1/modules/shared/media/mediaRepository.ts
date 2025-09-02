import mongoose from "mongoose";
import mediaModel from "../../../../../models/mediaModel";
import { BaseRepository } from "../repositories/baseRepository";

export class MediaRepository extends BaseRepository<any> {
    constructor() {
        super(mediaModel);
    }

    async findRelatedId(id: string): Promise<any> {
        return mediaModel.findOne({ relatedTo: id });
    }
    async findAllMediaWithEventIds(eventIds:string[]): Promise<any> {
        return mediaModel.find({relatedTo:{$in:eventIds}});
    }

    async getMediaByChapterId(eventIds:string):Promise<any>{
        return await mediaModel.find({relatedTo:{$in:eventIds}});

    }
}
