import mongoose, { Types } from "mongoose";
import { ITestimonial } from "../../../../../interfaces/models/Testimonial";
import Testimonial from "../../../../../models/testimonialSchema";
import { BaseRepository } from "../../shared/repositories/baseRepository";
import AskTestimonial from "../../../../../models/testimonialRequest";
import { compareSync } from "bcrypt";

export class TestimonialRepository extends BaseRepository<ITestimonial> {
    constructor() {
        super(Testimonial);
    }

    async findGivenTestimonial(userId: string): Promise<any> {
        return await Testimonial.aggregate([
            {
                $match: { fromUser: new mongoose.Types.ObjectId(userId) },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "toUser",
                    foreignField: "_id",
                    as: "userInfo",
                    pipeline: [{ $project: { name: 1, email: 1, _id: 0 } }],
                },
            },
            { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "profiles",
                    localField: "toUser",
                    foreignField: "userId",
                    as: "profileInfo",
                    pipeline: [{ $project: { image: 1, _id: 0, company: 1 } }],
                },
            },
            { $unwind: { path: "$profileInfo", preserveNullAndEmptyArrays: true } },

            // ✅ Final step: flatten and project only the required fields
            {
                $project: {
                    _id: 1, // keep if you want testimonial id
                    message: 1, // or whatever fields you want from Testimonial
                    name: "$userInfo.name",
                    email: "$userInfo.email",
                    company: "$profileInfo.company",
                    image: "$profileInfo.image",
                    createdAt: 1,
                },
            },
        ]);
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

    async findAllReceivedTestimonials(userId: string): Promise<ITestimonial[]> {
        return await Testimonial.aggregate([
            {
                $match: { toUser: new mongoose.Types.ObjectId(userId) },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "fromUser", // ✅ notice: it's fromUser (case-sensitive)
                    foreignField: "_id",
                    as: "userData",
                    pipeline: [{ $project: { name: 1, email: 1, _id: 0 } }],
                },
            },
            { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "profiles",
                    localField: "fromUser", // ✅ fixed typo: fromuser ➔ fromUser
                    foreignField: "userId",
                    as: "profileData",
                    pipeline: [{ $project: { image: 1, _id: 0, company: 1 } }],
                },
            },
            { $unwind: { path: "$profileData", preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    _id: 1, // Testimonial _id
                    message: 1, // ✅ include Testimonial fields you want
                    name: "$userData.name",
                    email: "$userData.email",
                    image: "$profileData.image",
                    company: "$profileData.company",
                    createdAt: 1,
                },
            },
        ]);
    }
    async findAllTestimonialRequest(userId: string): Promise<ITestimonial[]> {
        const res = await AskTestimonial.aggregate([
            {
                $match: { toUser: new mongoose.Types.ObjectId(userId) },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "fromUser",
                    foreignField: "_id",
                    as: "userData",
                    pipeline: [{ $project: { name: 1, email: 1, _id: 0 } }],
                },
            },
            { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "profiles",
                    localField: "fromUser",
                    foreignField: "userId",
                    as: "profileData",
                    pipeline: [{ $project: { image: 1, _id: 0, company: 1 } }],
                },
            },
            { $unwind: { path: "$profileData", preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    _id: 1, // Testimonial id
                    message: 1, // or whatever fields you want from AskTestimonial
                    name: "$userData.name",
                    email: "$userData.email",
                    image: "$profileData.image",
                    company: "$profileData.company",
                    createdAt: 1,
                },
            },
        ]);

        return res;
    }
}
