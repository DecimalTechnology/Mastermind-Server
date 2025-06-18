import { NotFoundError } from "../../../../../constants/customErrors";
import { IEvent } from "../../../../../interfaces/models/IEvent";
import { IUser } from "../../../../../interfaces/models/IUser";
import { ChapterRepository } from "../../admin/chapter/chapterRepository";
import { UserRepository } from "../../shared/repositories/userRepository";
import { EventRepository } from "./eventRepository";

export class EventService {
    constructor(private eventRepository: EventRepository, private userRepository: UserRepository, private chapterRepository: ChapterRepository) {}

    async getAllEvents(sort: string, filter: string, userId: string): Promise<IEvent[]> {
        const userData: IUser | null = await this.userRepository.findById(userId);
        if (!userData) throw new NotFoundError("Something went wrong. Chapter info not found");

        const chapterId = userData?.chapter?.toString();
        const chapterInfo = await this.chapterRepository.findById(chapterId||'');
       

        return await this.eventRepository.findEventsByFilter(sort, filter, chapterInfo,userId);
    }
}
