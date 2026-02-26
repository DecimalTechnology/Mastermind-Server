import { NotFoundError } from "../../../../../constants/customErrors";
import { IEvent } from "../../../../../interfaces/models/IEvent";
import { IUser } from "../../../../../interfaces/models/IUser";
import { ChapterRepository } from "../../admin/chapter/chapterRepository";
import { MediaRepository } from "../../shared/media/mediaRepository";
import { UserRepository } from "../../shared/repositories/userRepository";
import { AccountablityRepository } from "../accountabilitySlip/accountablitySilpRepository";
import { ProfileRepository } from "../profile/profileRepository";
import { EventRepository } from "./eventRepository";

export class EventService {
    constructor(
        private eventRepository: EventRepository,
        private userRepository: UserRepository,
        private chapterRepository: ChapterRepository,
        private mediaRepository: MediaRepository,
        private accountabilityRepository: AccountablityRepository,
        private profileRepository:ProfileRepository
    ) {}

    async getAllEvents(sort: string, filter: string, userId: string, date: string): Promise<any> {
        const userData: IUser | null = await this.userRepository.findById(userId);
        if (!userData) throw new NotFoundError("Something went wrong. Chapter info not found");

        const chapterId = userData?.chapter?.toString();
        const chapterInfo = await this.chapterRepository.findById(chapterId || "");

        const events =  await this.eventRepository.findEventsByFilter(sort, filter, chapterInfo, userId, date as string);
        const meetings = await this.accountabilityRepository.findAllAccountabilityByDate(userId,date,sort);
 
        
        return { events,meetings: meetings };
    }

    async getEventById(eventId: string, userId: string): Promise<IEvent | null> {
        const res = this.eventRepository.getEventByEventId(eventId, userId);
        if (!res) throw new NotFoundError("Event data not found ");
        return res;
    }
    async getEventByDate(date: any): Promise<IEvent | null> {
        const res = this.eventRepository.findEventByDate(date);
        if (!res) throw new NotFoundError("Event data not found ");
        return res;
    }
    async registerEvent(eventId: string, userId: string): Promise<IEvent | null> {
        const res = await this.eventRepository.registerEvent(eventId, userId);
        if (!res) throw new NotFoundError("Event data not found");
        return res;
    }
    async cancelRegistration(eventId: string, userId: string): Promise<IEvent | null> {
        const res = await this.eventRepository.cancelRegistration(eventId, userId);
        if (!res) throw new NotFoundError("Event data not found");
        return res;
    }

    async getAllMedia(userId: string): Promise<any> {
        const userParticipatedEvents = await this.eventRepository.userParticipatedEvent(userId);
        const eventIds = userParticipatedEvents.map((event: any) => event._id);

        const allMedia = await this.mediaRepository.findAllMediaWithEventIds(eventIds);

        const mediaList = allMedia.flatMap((item: any) => item.media);

        const images: string[] = [];
        const videos: string[] = [];

        for (const media of mediaList) {
            if (media.type === "image") {
                images.push(...media.urls);
            } else {
                videos.push(...media.urls);
            }
        }

        return { images, videos };
    }
}
