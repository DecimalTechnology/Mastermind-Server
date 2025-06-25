import { NotFoundError } from "../../../../../constants/customErrors";
import { ITestimonial } from "../../../../../interfaces/models/Testimonial";
import { UserRepository } from "../../shared/repositories/userRepository";
import { TestimonialRepository } from "./testimonialRepository";

export class TestimonialService {
    constructor(private testimonialRepository: TestimonialRepository, private userRepository: UserRepository) {}

    async createTestimonial(data: any): Promise<ITestimonial> {
        const user = await this.userRepository.findById(data?.toUser);
        if (!user) throw new NotFoundError("The user that you send testimonial is invalid");
        return await this.testimonialRepository.create(data);
    }
    async createAskTestimonial(data: any): Promise<any> {
        const user = await this.userRepository.findById(data?.toUser);
        if (!user) throw new NotFoundError("The user that you send ask testimonial is invalid");
        return await this.testimonialRepository.createAskTestiMonial(data);
    }
    async getAllGivenTestimonial(userId: string): Promise<ITestimonial[]> {
        return await this.testimonialRepository.findGivenTestimonial(userId);
    }
    async getAllTestimonialCount(userId: string): Promise<ITestimonial[]> {
        return await this.testimonialRepository.findAllTestimonialCount(userId);
    }
    async getAllReceivedTestimonials(userId: string): Promise<ITestimonial[]> {
        return await this.testimonialRepository.findAllReceivedTestimonials(userId);
    }
    async getAllTestimonialRequests(userId: string): Promise<ITestimonial[]> {
        return await this.testimonialRepository.findAllTestimonialRequest(userId);
    }
}
