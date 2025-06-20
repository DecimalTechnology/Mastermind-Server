import { IEvent } from "../../../../../interfaces/models/IEvent";
import { IUser } from "../../../../../interfaces/models/IUser";
import { uploadImageToCloudinary } from "../../../../../utils/v1/cloudinary/uploadToCloudinary";
import { EventRepository } from "./eventRepository";

export class EventServices {
    constructor(private eventRepository: EventRepository) {}
    async getAllUsersByLevel(level: string, levelId: string, search: string): Promise<IUser[]> {
        return await this.eventRepository.findAllUsersByLevel(level, levelId, search);
    }
    async createEvent(eventData: IEvent, files: any, adminId: string): Promise<any> {
        const images: any = await uploadImageToCloudinary(files);
        const image = images.results[0].url;
        const newEventObj = { ...eventData, image, createdBy: adminId };
        console.log(newEventObj)
        return await this.eventRepository.create(newEventObj);
    }

    async getAllEvents():Promise<IEvent[]>{
        return await this.eventRepository.getAllEvents()
    }
}
