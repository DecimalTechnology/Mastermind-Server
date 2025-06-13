import { IChapter } from "../../../../../interfaces/models/IChaper";
import { ChapterRepository } from "./chapterRepository";

export class ChapterService {
    constructor(private chapterRepository: ChapterRepository) {}

    async createChapter(data: IChapter): Promise<IChapter> {
        return await this.chapterRepository.create(data);
    }
    async getAllChapters(): Promise<IChapter[]> {
        return await this.chapterRepository.findAllChapters();
    }
}
