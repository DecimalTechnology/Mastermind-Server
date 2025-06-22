import { ITestimonial } from "../../../../../interfaces/models/Testimonial";
import { UserRepository } from "../../shared/repositories/userRepository";
import { TestimonialRepository } from "./testimonialRepository";

export class TestimonialService {
    constructor(private testimonialRepository: TestimonialRepository, private userRepository: UserRepository) {}

    async createTestimonial(data: any): Promise<ITestimonial> {
        return await this.testimonialRepository.create(data);
    }
    async createAskTestimonial(data: any): Promise<any> {
        return await this.testimonialRepository.createAskTestiMonial(data);
    }
    async getAllGivenTestimonial(userId:string): Promise<ITestimonial[]> {
        return await this.testimonialRepository.findGivenTestimonial(userId);
    }
    async getAllTestimonialCount(userId:string): Promise<ITestimonial[]> {
        return await this.testimonialRepository.findAllTestimonialCount(userId);
    }
}
