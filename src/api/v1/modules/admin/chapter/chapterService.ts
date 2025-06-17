import { NotFoundError } from "../../../../../constants/customErrors";
import { UserRole } from "../../../../../enums/common";
import { IChapter } from "../../../../../interfaces/models/IChaper";
import { ILocal } from "../../../../../interfaces/models/ILocal";
import { IUser } from "../../../../../interfaces/models/IUser";
import User from "../../../../../models/userModel";
import { UserRepository } from "../../shared/repositories/userRepository";
import { LocalRepository } from "../local/localRepository";
import { ChapterRepository } from "./chapterRepository";

export class ChapterService {
    constructor(private chapterRepository: ChapterRepository, private userRepository: UserRepository, private localRepository: LocalRepository) {}

    async createChapter(data: IChapter): Promise<any> {
        const coreTeam = data?.coreTeam;
        const newChapter = await this.chapterRepository.create(data);
        if (!newChapter) throw new NotFoundError("Something went wrong. Chapter id not found");
        await this.userRepository.updateCoreTeamData(coreTeam, { role: UserRole.CORE_TEAM_ADMIN, manage: { chapter: newChapter?._id } });
        const chapterData = await this.chapterRepository.findChapterById(newChapter?._id);

        return chapterData[0];
    }

    async getAllChapters(search: string, localId: string): Promise<{ local: ILocal | null; chapters: IChapter[] }> {
        const allChapters = await this.chapterRepository.findAllChapters(search as string);
        const localData = await this.localRepository.findById(localId);
        return { local: localData, chapters: allChapters };
    }

    async getAllUsersBySearch(search: string): Promise<IUser[]> {
        return await this.chapterRepository.findUsersBySearch(search);
    }
    async getChaperById(chapterId: string): Promise<IUser[]> {
        return await this.chapterRepository.findChapterDetailsById(chapterId);
    }
    async getAllUsersByLevel(level: string, levelId: string,search:string): Promise<IUser[]> {
        return await this.chapterRepository.findAllUsersByLevel(level, levelId,search);
    }
}
