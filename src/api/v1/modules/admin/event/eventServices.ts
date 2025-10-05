import { NotFoundError } from "../../../../../constants/customErrors";
import { IEvent } from "../../../../../interfaces/models/IEvent";
import { IReport } from "../../../../../interfaces/models/IReport";
import { IUser } from "../../../../../interfaces/models/IUser";
import { deleteImageFromCloudinary } from "../../../../../utils/v1/cloudinary/deleteImageFromCloudinary";
import { uploadPdfToCloudinary } from "../../../../../utils/v1/cloudinary/uploadPdf";
import { uploadImageToCloudinary } from "../../../../../utils/v1/cloudinary/uploadToCloudinary";
import { MediaRepository } from "../../shared/media/mediaRepository";
import { ReportRepository } from "../../shared/repositories/reportRepository";
import { EventRepository } from "./eventRepository";

export class EventServices {
    constructor(private eventRepository: EventRepository, private reportRepository: ReportRepository, private medialRepository: MediaRepository) {}
    async getAllUsersByLevel(level: string, levelId: string, search: string): Promise<IUser[]> {
        return await this.eventRepository.findAllUsersByLevel(level, levelId, search);
    }
    async createEvent(eventData: IEvent, files: any, adminId: string,image:string): Promise<any> {
        
        const newEventObj = { ...eventData, image, createdBy: adminId };
        
        return await this.eventRepository.create(newEventObj);
    }

    async getAllEvents(chapterId: string, query: any): Promise<IEvent[]> {
        return await this.eventRepository.getAllEvents(chapterId, query);
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
        return await this.eventRepository.getAllAttendeesList(eventId);
    }
    async getAllRsvpList(eventId: string): Promise<any> {
        return await this.eventRepository.findRsvpList(eventId);
    }
    async eventPartialUpdate(eventId: string, data: any): Promise<any> {
        return await this.eventRepository.findByIdAndUpdate(eventId, data);
    }
    async cancelEvent(eventId: string, data: any): Promise<IEvent> {
        // Sending notification or any other logic while cancelling can be written here
        return await this.eventRepository.findByIdAndUpdate(eventId, { status: "cancelled" });
    }
    async getEventById(eventId: string): Promise<IEvent> {
        const event = await this.eventRepository.findByEventId(eventId);
        if (!event) throw new NotFoundError("Event details id not found");
        return event;
    }
    async createChapterEventReport(reportData: IReport, pdf: any): Promise<any> {
       
        const data = { ...reportData, file: pdf };
        return await this.reportRepository.createReport(data);
    }

    async uploadMediaImages(adminId: string, eventId: string, images: string[]): Promise<any> {
        const isExists = await this.medialRepository.findRelatedId(eventId);

        if (isExists) {
            const newImgeObject = { type: "image", uploadedAt: new Date(), uploadedBy: adminId, urls: images };
            isExists.media.push(newImgeObject);
            await isExists.save();
        } else {
            const newImgeObject = { type: "image", uploadedAt: new Date(), uploadedBy: adminId, urls: images };
            const newMediaObject = { relatedTo: eventId, relatedModel: "Event", media: [newImgeObject] };
            return await this.medialRepository.create(newMediaObject);
        }
    }
    async uploadVideos(adminId: string, eventId: string, videos: string[]): Promise<any> {
        const isExists = await this.medialRepository.findRelatedId(eventId);

        if (isExists) {
            const newVideoObject = { type: "video", uploadedAt: new Date(), uploadedBy: adminId, urls: videos };
            isExists.media.push(newVideoObject);
            await isExists.save();
        } else {
            const newVideoObject = { type: "video", uploadedAt: new Date(), uploadedBy: adminId, urls: videos };
            const newMediaObject = { relatedTo: eventId, relatedModel: "Event", media: [newVideoObject] };
            return await this.medialRepository.create(newMediaObject);
        }
    }

    async getAllMedia(relatedTo: string): Promise<any> {
        return await this.medialRepository.findRelatedId(relatedTo);
    }
}
