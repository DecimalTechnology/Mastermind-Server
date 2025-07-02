import { IEvent } from "../../../../../interfaces/models/IEvent";
import { IUser } from "../../../../../interfaces/models/IUser";
import { deleteImageFromCloudinary } from "../../../../../utils/v1/cloudinary/deleteImageFromCloudinary";
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
        console.log(newEventObj);
        return await this.eventRepository.create(newEventObj);
    }

    async getAllEvents(chapterId:string): Promise<IEvent[]> {
        return await this.eventRepository.getAllEvents(chapterId);
    }
    async updateEvent(eventId: string, data: IEvent, files: any): Promise<IEvent[]> {
        if (files.length == 0) {
            return await this.eventRepository.findByIdAndUpdate(eventId, data);
        } else {
            const event = await this.eventRepository.findById(eventId);
            const oldImage = event?.image;
            await deleteImageFromCloudinary(oldImage || "");
            const images: any = await uploadImageToCloudinary(files);
            const image = images.results[0].url;
            const newData = { ...data, image: image };
            return await this.eventRepository.findByIdAndUpdate(eventId, newData);
        }
    }

    async getAllAttendeesList(eventId: string): Promise<any> {
        return await this.eventRepository.getAllAttendeesList(eventId)
    }
    async getAllRsvpList(eventId: string): Promise<any> {
        return await this.eventRepository.findRsvpList(eventId)
    }
    async eventPartialUpdate(eventId: string,data:any): Promise<any> {
        return await this.eventRepository.findByIdAndUpdate(eventId,data)
    }
}
