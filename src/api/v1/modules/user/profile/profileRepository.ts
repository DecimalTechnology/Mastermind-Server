import mongoose, { connections, ObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";
import { IProfile } from "../../../../../interfaces/models/IProfile";
import { IUser } from "../../../../../interfaces/models/IUser";
import Profile from "../../../../../models/profileModel";
import User from "../../../../../models/userModel";
import { deleteImageFromCloudinary } from "../../../../../utils/v1/cloudinary/deleteImageFromCloudinary";
import { IConnections } from "../../../../../interfaces/models/IConnection";
import Connection from "../../../../../models/connectionModel";

export class ProfileRepository {
    async findProfileById(userId: string): Promise<any | null> {
        try {
            return await Profile.findOne({ userId: userId }).lean();
        } catch (error) {
            throw error;
        }
    }

    async findUserById(userId: string): Promise<IUser | null> {
        try {
            return await User?.findOne({ _id: userId }).lean();
        } catch (error) {
            throw error;
        }
    }
    async updateProfile(userId: string, profileData: any): Promise<any | null> {
        try {
            if (profileData?.name) {
                await User.findByIdAndUpdate(userId, { name: profileData?.name });
            }
            return await Profile?.findOneAndUpdate({ userId: userId }, profileData, { new: true });
        } catch (error) {
            throw error;
        }
    }
    async updateProfileImage(userId: string, image: string): Promise<String | null> {
        try {
            const user = await Profile.findOne({ userId: userId });

            if (user) await deleteImageFromCloudinary(user?.image);

            return await Profile?.findOneAndUpdate({ userId: userId }, { $set: { image: image } }, { new: true });
        } catch (error) {
            console.log("Error while finding user by Id in the profile repository");
            throw error;
        }
    }
    async findUserBySearchQuery(query: any, userId: string): Promise<any> {
        try {
            const { search, company, googleMapLocation, page, type } = query;
            const user = await User.findById(userId);
            const chapterId = user?.chapter;
            const matchStage: any = {};
            matchStage.name = { $regex: search, $options: "i" };
            matchStage["_id"] = { $ne: new mongoose.Types.ObjectId(userId) };
            type == "chapter" ? (matchStage.chapter = new mongoose.Types.ObjectId(chapterId)) : "";
            const filterMatchStage: any = {};
            company ? (filterMatchStage["profileData.company"] = company) : "";
            googleMapLocation ? (filterMatchStage["profileData.googleMapLocation"] = googleMapLocation) : "";

            const result = await User.aggregate([
                {
                    $match: {
                        name: { $regex: search, $options: "i" },
                    },
                },
                {
                    $match: matchStage,
                },
                {
                    $lookup: {
                        from: "profiles", // Collection name
                        localField: "_id", // User `_id`
                        foreignField: "userId", // Profile's `userId`
                        as: "profileData",
                    },
                },

                {
                    $project: {
                        _id: 1,
                        name: 1,
                        image: { $arrayElemAt: ["$profileData.image", 0] },
                        profileId: { $arrayElemAt: ["$profileData._id", 0] },
                        company: { $arrayElemAt: ["$profileData.company", 0] },
                        googleMapLocation: { $arrayElemAt: ["$profileData.googleMapLocation", 0] },
                    },
                },
                { $match: filterMatchStage },
                {
                    $project: {
                        googleMapLocation: 0,
                    },
                },
            ]);
            return result;
        } catch (error) {
            console.log("Error while finding user by Id in the profile repository");
            throw error;
        }
    }

    async findProfileBy_id(profileId: string): Promise<IProfile | null> {
        try {
            const res = await Profile.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(profileId) },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userData",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        userId: { $arrayElemAt: ["$userData._id", 0] },
                        name: { $arrayElemAt: ["$userData.name", 0] },
                        chapter: { $arrayElemAt: ["$userData.chapter", 0] },
                        region: { $arrayElemAt: ["$userData.region", 0] },
                        image: 1,
                        company: 1,
                        about: 1,
                        dob: 1,
                        phoneNumbers: 1,
                        googleMapLocation: 1,
                        website: 1,
                        memberSince: 1,
                        email: 1,
                        industries: 1,
                        socialMediaLinks: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
            ]);

            return res[0];
        } catch (error) {
            console.log("Error finding profile by Id");
            throw error;
        }
    }

    async findConnectionById(userId: string): Promise<IConnections | null> {
        try {
            return await Connection.findOne({ userId: userId });
        } catch (error) {
            throw error;
        }
    }
    async findConnectionsDataByArray(data: any[]): Promise<any | null> {
        try {
            return await Connection.find({ userId: data });
        } catch (error) {
            throw error;
        }
    }
    async createConnection(connectionData: any): Promise<IConnections | null> {
        try {
            const newConnection = new Connection(connectionData);
            await newConnection.save();
            return newConnection;
        } catch (error) {
            throw error;
        }
    }
    async addConnection(senderId: string, receiverId: string): Promise<Record<string, any> | null> {
        try {
            return Connection.bulkWrite([
                {
                    updateOne: {
                        filter: { userId: senderId },
                        update: { $addToSet: { sentRequests: receiverId } }, // Add receiverId to sentRequests array
                    },
                },
                {
                    updateOne: {
                        filter: { userId: receiverId }, // Find the receiver
                        update: { $addToSet: { receiveRequests: senderId } }, // Add senderId to receiveRequests array
                    },
                },
            ]);
        } catch (error) {
            throw error;
        }
    }

    async findAlreadyConnected(senderId: any): Promise<IConnections | null> {
        try {
            return await Connection.findOne({ userId: senderId });
        } catch (error) {
            throw error;
        }
    }

    async acceptConnection(userId: string, senderId: any): Promise<Record<string, any> | null> {
        try {
            return await Connection.bulkWrite([
                {
                    updateOne: {
                        filter: { userId: new mongoose.Types.ObjectId(userId) },
                        update: { $addToSet: { connections: new mongoose.Types.ObjectId(senderId) } }, // Add sender to connections
                    },
                },
                {
                    updateOne: {
                        filter: { userId: new mongoose.Types.ObjectId(senderId) },
                        update: { $addToSet: { connections: new mongoose.Types.ObjectId(userId) } }, // Add receiver to sender's connections
                    },
                },
                {
                    updateOne: {
                        filter: { userId: new mongoose.Types.ObjectId(userId) },
                        update: { $pull: { receiveRequests: new mongoose.Types.ObjectId(senderId) } }, // Remove senderId from receiver's receiveRequests
                    },
                },
                {
                    updateOne: {
                        filter: { userId: new mongoose.Types.ObjectId(senderId) },
                        update: { $pull: { sentRequests: new mongoose.Types.ObjectId(userId) } }, // Remove receiverId from sender's sentRequests
                    },
                },
            ]);
        } catch (error) {
            throw error;
        }
    }

    async removeConnection(userId: string, senderId: any): Promise<Record<string, any> | null> {
        try {
            const result = await Connection.bulkWrite([
                {
                    updateOne: {
                        filter: { userId: new mongoose.Types.ObjectId(userId) },
                        update: { $pull: { connections: new mongoose.Types.ObjectId(senderId) } },
                    },
                },
                {
                    updateOne: {
                        filter: { userId: new mongoose.Types.ObjectId(senderId) },
                        update: { $pull: { connections: new mongoose.Types.ObjectId(userId) } },
                    },
                },
            ]);

            if (result.modifiedCount <= 0) throw new NotFoundError("Failed to disconnect user");
            return result;
        } catch (error) {
            throw error;
        }
    }

    async cancelConnection(userId: string, senderId: string): Promise<any | null> {
        try {
            const result = await Connection.bulkWrite([
                {
                    updateOne: {
                        filter: { userId: new mongoose.Types.ObjectId(userId) },
                        update: { $pull: { sentRequests: new mongoose.Types.ObjectId(senderId) } },
                    },
                },
                {
                    updateOne: {
                        filter: { userId: new mongoose.Types.ObjectId(senderId) },
                        update: { $pull: { receiveRequests: new mongoose.Types.ObjectId(userId) } },
                    },
                },
            ]);

            if (result.modifiedCount <= 0) throw new NotFoundError("Failed to disconnect user");
            return { connectionStatus: "not_connected" };
        } catch (error) {
            throw error;
        }
    }

    async findConnectionByUserId(userId: string): Promise<any | null> {
        try {
            return await Connection.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $project: {
                        _id: 0,
                        connections: { $size: "$connections" },
                        sentRequests: { $size: "$sentRequests" },
                        receiveRequests: { $size: "$receiveRequests" },
                    },
                },
            ]);
        } catch (error) {
            throw error;
        }
    }

    async findSendRequests(senderId: any): Promise<any | null> {
        try {
            const userConnections = await Connection.aggregate([
                {
                    $match: { userId: new mongoose.Types.ObjectId(senderId) },
                },
                {
                    $unwind: "$sentRequests",
                },
                {
                    $project: { sentRequests: 1, _id: 0 },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "sentRequests",
                        foreignField: "_id",
                        as: "userData",
                    },
                },
                {
                    $unwind: "$userData",
                },
                {
                    $project: { "userData.name": 1, "userData._id": 1 },
                },
                {
                    $replaceRoot: { newRoot: "$userData" },
                },
                {
                    $lookup: {
                        from: "profiles",
                        localField: "_id",
                        foreignField: "userId",
                        as: "profileData",
                    },
                },
                {
                    $unwind: { path: "$profileData", preserveNullAndEmptyArrays: true }, // Ensures users without a profile are included
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        image: "$profileData.image",
                        company: "$profileData.company",
                        profileId: "$profileData._id",
                    },
                },
            ]);

            return userConnections;
        } catch (error) {
            throw error;
        }
    }

    async findReceiveRequests(userId: any): Promise<any | null> {
        try {
            const userConnections = await Connection.aggregate([
                {
                    $match: { userId: new mongoose.Types.ObjectId(userId) },
                },
                {
                    $unwind: "$receiveRequests",
                },
                {
                    $project: { receiveRequests: 1, _id: 0 },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "receiveRequests",
                        foreignField: "_id",
                        as: "userData",
                    },
                },
                {
                    $unwind: "$userData",
                },
                {
                    $project: { "userData.name": 1, "userData._id": 1 },
                },
                {
                    $replaceRoot: { newRoot: "$userData" },
                },
                {
                    $lookup: {
                        from: "profiles",
                        localField: "_id",
                        foreignField: "userId",
                        as: "profileData",
                    },
                },
                {
                    $unwind: { path: "$profileData", preserveNullAndEmptyArrays: true }, // Ensures users without a profile are included
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        image: "$profileData.image",
                        company: "$profileData.company",
                        profileId: "$profileData._id",
                    },
                },
            ]);

            return userConnections;
        } catch (error) {
            throw error;
        }
    }

    async findAllConnections(userId: any): Promise<any | null> {
        try {
            const userConnections = await Connection.aggregate([
                {
                    $match: { userId: new mongoose.Types.ObjectId(userId) },
                },
                {
                    $unwind: "$connections",
                },
                {
                    $project: { connections: 1, _id: 0 },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "connections",
                        foreignField: "_id",
                        as: "userData",
                    },
                },
                {
                    $unwind: "$userData",
                },
                {
                    $project: { "userData.name": 1, "userData._id": 1 },
                },
                {
                    $replaceRoot: { newRoot: "$userData" },
                },
                {
                    $lookup: {
                        from: "profiles",
                        localField: "_id",
                        foreignField: "userId",
                        as: "profileData",
                    },
                },
                {
                    $unwind: { path: "$profileData", preserveNullAndEmptyArrays: true }, // Ensures users without a profile are included
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        image: "$profileData.image",
                        company: "$profileData.company",
                        profileId: "$profileData._id",
                    },
                },
            ]);

            return userConnections;
        } catch (error) {
            throw error;
        }
    }

    async findProfileByUserId(userId: string): Promise<any> {
        return await Profile.findOne({ userId: userId });
    }

    async findConnectionCount(userId: string): Promise<any> {
        const connections = await Profile.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $project: { $size: "$connections" } },
        ]);
        console.log(connections);
        return connections;
    }


    async findNextAccountablityMeeting(userId:string):Promise<any>{
         
    }
}
