import { Types } from "mongoose";
import { ITestimonial } from "../../../../../interfaces/models/Testimonial";
import Testimonial from "../../../../../models/testimonialSchema";
import { BaseRepository } from "../../shared/repositories/baseRepository";
import AskTestimonial from "../../../../../models/testimonialRequest";

export class TestimonialRepository extends BaseRepository<ITestimonial> {
    constructor() {
        super(Testimonial);
    }

    async findGivenTestimonial(userId: string): Promise<any> {
        return await Testimonial.find({ fromUser: userId });
    }
    async createAskTestiMonial(data: any): Promise<any> {
        const newTestimonial = new AskTestimonial(data);
        await newTestimonial.save();
        return newTestimonial;
    }
    async findAllTestimonialCount(userId: string): Promise<any> {
        const counts = await Testimonial.aggregate([
            {
                $facet: {
                    givenCount: [{ $match: { fromUser: new Types.ObjectId(userId) } }, { $count: "count" }],
                    receivedCount: [{ $match: { toUser: new Types.ObjectId(userId) } }, { $count: "count" }],
                },
            },
        ]);

        const requestCount = await AskTestimonial.countDocuments({ toUser: userId });

        const givenCount = counts[0].givenCount[0]?.count || 0;
        const receivedCount = counts[0].receivedCount[0]?.count || 0;

        console.log(requestCount, givenCount, receivedCount);

        return {
            givenCount,
            receivedCount,
            requestCount,
        };
    }
}
