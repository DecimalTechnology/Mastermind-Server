import mongoose from "mongoose";
import { NotFoundError } from "../../../../../constants/customErrors";
import { UserRole } from "../../../../../enums/common";
import { IAccountablity } from "../../../../../interfaces/models/IAccountablity";
import { IChapter } from "../../../../../interfaces/models/IChaper";
import { ILocal } from "../../../../../interfaces/models/ILocal";
import { IUser } from "../../../../../interfaces/models/IUser";
import User from "../../../../../models/userModel";
import { UserRepository } from "../../shared/repositories/userRepository";
import { AccountablityRepository } from "../../user/accountabilitySlip/accountablitySilpRepository";
import { LocalRepository } from "../local/localRepository";
import { ChapterRepository } from "./chapterRepository";
import { MediaRepository } from "../../shared/media/mediaRepository";
import { EventRepository } from "../event/eventRepository";

export class ChapterService {
    constructor(
        private chapterRepository: ChapterRepository,
        private userRepository: UserRepository,
        private localRepository: LocalRepository,
        private accountabilityRepository: AccountablityRepository,
        private mediaRepository: MediaRepository,
        private eventRepository: EventRepository,
    ) {}

    async createChapter(data: IChapter): Promise<any> {
        const coreTeam = data?.coreTeam;
        const newChapter = await this.chapterRepository.create(data);
        if (!newChapter) throw new NotFoundError("Something went wrong. Chapter id not found");
        await this.userRepository.updateCoreTeamData(coreTeam, { role: UserRole.CORE_TEAM_ADMIN, manage: { chapter: newChapter?._id } });
        const chapterData = await this.chapterRepository.findChapterById(newChapter?._id);

        return chapterData[0];
    }

    async getAllChapters(search: string, localId: string): Promise<{ local: ILocal | null; chapters: IChapter[] }> {
        const localData = await this.localRepository.findById(localId);
        const allChapters = await this.chapterRepository.findAllChapters(search as string, localData?._id as string);
        return { local: localData, chapters: allChapters };
    }

    async getAllUsersBySearch(search: string): Promise<IUser[]> {
        return await this.chapterRepository.findUsersBySearch(search);
    }
    async getChaperById(chapterId: string): Promise<IUser[]> {
        return await this.chapterRepository.findChapterDetailsById(chapterId);
    }
    async getAllUsersByLevel(level: string, levelId: string, search: string): Promise<IUser[]> {
        return await this.chapterRepository.findAllUsersByLevel(level, levelId, search);
    }
    async getAllMembersByChapterId(chapterId: string, query: any): Promise<IUser[]> {
        return await this.userRepository.findMembersByChapterId(chapterId, query);
    }
    async blockUser(userId: string): Promise<IUser> {
        return await this.userRepository.blockUser(userId);
    }
    async unblockUser(userId: string): Promise<IUser> {
        return await this.userRepository.unblockUser(userId);
    }
    async getChapterById(chapterId: string): Promise<any> {
        return await this.chapterRepository.findChapterByChapterId(chapterId);
    }
    async findMembers(adminId: string, query: any): Promise<IUser[]> {

        
        return await this.chapterRepository.findMembers(adminId, query);
    }
    async getProfile(adminId: string): Promise<IUser[]> {
        return await this.chapterRepository.getProfile(adminId);
    }

    async getAllChapterMembers(chapterId: string): Promise<IChapter[]> {
        const chapter = await this.chapterRepository.findById(chapterId);
        if (!chapter) throw new NotFoundError("Chapter not found");
        return await this.chapterRepository.findAllMembersOfChapter(chapterId);
    }

    async createMeeting(meetingData: any): Promise<IAccountablity | null> {
        return await this.accountabilityRepository.create(meetingData);
    }

    async getAllMeeting(adminId: string, query: any): Promise<any | []> {
        const { search, page = 1, status, limit = 10, date } = query;

        const pipeline: any[] = [];
        const matchStage: any = {
            $or: [{ userId: new mongoose.Types.ObjectId(adminId) }, { members: { $in: [new mongoose.Types.ObjectId(adminId)] } }],
        };

        // Search by place
        if (search) {
            matchStage.place = { $regex: search, $options: "i" };
        }

        // Status filter
        if (status === "upcoming") {
            matchStage.date = { $gte: new Date() };
        }
        if (status === "ended") {
            matchStage.date = { $lte: new Date() };
        }

        // Date filter (specific day)
        if (date) {
            const start = new Date(date + "T00:00:00.000Z");
            const end = new Date(date + "T23:59:59.999Z");
            matchStage.date = { $gte: start, $lte: end };
        }

        pipeline.push({ $match: matchStage });

        //Pagination
        pipeline.push({ $skip: (Number(page) - 1) * Number(limit) });
        pipeline.push({ $limit: Number(limit) });

        let meetings;

        if (status == "next") {
            meetings = await this.accountabilityRepository.findNextMeeting(adminId);
        } else {
            meetings = await this.accountabilityRepository.getAllMeetingByAdminId(pipeline);
        }

        const totalMeetingCount = await this.accountabilityRepository.countDocuments();

        return { meetings, totalCount: totalMeetingCount };
    }

    async getAllMedia(chapterId: string): Promise<any> {
        const events = await this.eventRepository.aggregate([{ $match: { chapterId: new mongoose.Types.ObjectId(chapterId) } }, { $project: { _id: 1 } }]);
        const objectIds = events.map((i: Record<string, any>) => i?._id);

        return await this.mediaRepository.getMediaByChapterId(objectIds);
    }
}
