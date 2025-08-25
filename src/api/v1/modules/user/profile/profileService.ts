import mongoose, { ConnectionStates } from "mongoose";
import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";
import { IConnections } from "../../../../../interfaces/models/IConnection";
import { IProfile } from "../../../../../interfaces/models/IProfile";
import { uploadImageToCloudinary } from "../../../../../utils/v1/cloudinary/uploadToCloudinary";
import { ProfileRepository } from "./profileRepository";
import { ChapterRepository } from "../../admin/chapter/chapterRepository";
import { UserRepository } from "../../shared/repositories/userRepository";
import { AccountablityRepository } from "../accountabilitySlip/accountablitySilpRepository";

export class ProfileService {
    constructor(
        private profileRepository: ProfileRepository,
        private chapterRepository: ChapterRepository,
        private userRepository: UserRepository,
        private accountabilityRepository: AccountablityRepository
    ) {}

    async getProfile(userId: string): Promise<Record<string, any> | null> {
        try {
            const res = await this.profileRepository.findProfileById(userId);
            if (!res) throw new NotFoundError("Profile details not found");
            const user: any = await this.profileRepository.findUserById(userId);

            const chapter = await this.chapterRepository.findChapter(user?.chapter);

            return {
                ...res,
                name: user?.name,
                chapter: chapter?.name,
                region: chapter?.regionId?.name,
                nation: chapter?.nationId?.name,
                local: chapter?.localId?.name,
            };
        } catch (error) {
            console.log("Error while fetching profile information");
            throw error;
        }
    }
    async updateProfile(profileData: IProfile, userId: string): Promise<any | null> {
        try {
            const industries = profileData.industries;
            profileData.industries = industries;
            const { image, ...newProfileData } = profileData;
            await this.profileRepository.updateProfile(userId, newProfileData);
            return this.getProfile(userId);
        } catch (error) {
            console.log("Error while updating profile");
            throw error;
        }
    }
    async updateProfilePicture(userId: string, files: any): Promise<any | null> {
        try {
            const images: any = await uploadImageToCloudinary(files);
            if (!images?.success) throw new BadRequestError("Profile picture failed to update");
            const image = images?.results[0].url;
            const result = await this.profileRepository.updateProfileImage(userId, image);

            if (!result) throw new BadRequestError("Something went wrong, Profile picture failed to update");
            return result;
        } catch (error) {
            console.log("Error while updating profile picture");
            throw error;
        }
    }
    async searchProfile(query: string, userId: string): Promise<Record<string, any> | null> {
        try {
            return await this.profileRepository.findUserBySearchQuery(query, userId);
        } catch (error) {
            console.log("Error while updating profile picture");
            throw error;
        }
    }
    async getProfileById(profileId: string, currentUserId: string): Promise<any | null> {
        try {
            const res = await this.profileRepository.findProfileBy_id(profileId);

            if (!res) throw new NotFoundError("Profile not found");

            const receiverId = res?.userId.toString(); // Ensure receiverId is a string
            const senderId = currentUserId.toString(); // Ensure senderId is a string

            const connectionHistory = await this.profileRepository.findAlreadyConnected(senderId);

            let connectionStatus = "not_connected"; // Default

            if (connectionHistory) {
                const isConnected = connectionHistory?.connections?.some((id: any) => id.toString() === receiverId);
                const isRequestSent = connectionHistory?.sentRequests?.some((id: any) => id.toString() === receiverId);
                const isRequestReceived = connectionHistory?.receiveRequests?.some((id: any) => id.toString() === receiverId);

                if (isConnected) {
                    connectionStatus = "connected";
                } else if (isRequestSent) {
                    connectionStatus = "request_sent";
                } else if (isRequestReceived) {
                    connectionStatus = "request_received";
                } else {
                    connectionStatus = "not_connected";
                }
            }

            // Attach connection status to the profile response
            return { ...res, connectionStatus };
        } catch (error) {
            console.log("Error while while finding profie by _id");
            throw error;
        }
    }
    async connectUser(senderId: string, receiverId: string): Promise<any> {
        try {
            const connection = await this.profileRepository.findConnectionsDataByArray([
                new mongoose.Types.ObjectId(senderId),
                new mongoose.Types.ObjectId(receiverId),
            ]);

            const senderDataIndex = connection.findIndex((obj: any) => obj?.userId == senderId);
            const receiverDataIndex = connection.findIndex((obj: any) => obj?.userId == receiverId);

            if (senderDataIndex < 0) {
                const newConnectionData = {
                    userId: senderId,
                    connections: [],
                    sentRequests: [receiverId],
                    receiveRequests: [],
                };

                await this.profileRepository.createConnection(newConnectionData);
            }

            if (receiverDataIndex < 0) {
                const newConnectionData = {
                    userId: receiverId,
                    connections: [],
                    sentRequests: [],
                    receiveRequests: [senderId],
                };

                await this.profileRepository.createConnection(newConnectionData);
            }
            await this.profileRepository.addConnection(senderId, receiverId);
            return { connectionStatus: "request_sent" };
        } catch (error) {
            console.log("Error: connect user");
            throw error;
        }
    }

    async acceptConnection(userId: string, senderId: string): Promise<Record<string, any> | null> {
        try {
            const result = await this.profileRepository.acceptConnection(userId, senderId);
            return { connectionStatus: "connected" };
        } catch (error) {
            console.log("Error: accept connection ");
            throw error;
        }
    }
    async removeConnection(userId: string, senderId: string): Promise<Record<string, any> | null> {
        try {
            const res = await this.profileRepository.removeConnection(userId, senderId);
            return { connectionStatus: "not_connected" };
        } catch (error) {
            console.log("Error: remove connection");
            throw error;
        }
    }
    async cancelConnection(userId: string, senderId: string): Promise<Record<string, any> | null> {
        try {
            const result = await this.profileRepository.cancelConnection(userId, senderId);
            return { connectionStatus: "not_connected" };
        } catch (error) {
            console.log("Error: cancel connection");
            throw error;
        }
    }
    async getConnections(userId: string): Promise<IConnections | null> {
        try {
            const result = await this.profileRepository.findConnectionByUserId(userId);
            if (!result) throw new NotFoundError("The required data not found ");
            return result;
        } catch (error) {
            console.log("Error: get connections");
            throw error;
        }
    }
    async getSendRequests(userId: string): Promise<any | null> {
        try {
            const result = await this.profileRepository.findSendRequests(userId);
            if (!result) throw new NotFoundError("Sent request list not found");
            return result;
        } catch (error) {
            console.log("Error: get sent requests");
            throw error;
        }
    }
    async getReceiveRequests(userId: string): Promise<any | null> {
        try {
            const result = await this.profileRepository.findReceiveRequests(userId);
            if (!result) throw new NotFoundError("Sent request list not found");
            return result;
        } catch (error) {
            console.log("Error: get sent requests");
            throw error;
        }
    }
    async getAllConnections(userId: string): Promise<any | null> {
        try {
            const result = await this.profileRepository.findAllConnections(userId);
            if (!result) throw new NotFoundError("Sent request list not found");
            return result;
        } catch (error) {
            console.log("Error: get sent requests");
            throw error;
        }
    }

    async getHomeProfile(userId: string): Promise<any> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) throw new NotFoundError("User not found");
    
            const profile = await this.profileRepository.findProfileByUserId(userId);
            if (!profile) throw new NotFoundError("Profile not found");
    
            if (!user.chapter) throw new NotFoundError("Chapter not found");
            const chapter = await this.chapterRepository.findChapter(user.chapter.toString());
    
            const connections = await this.profileRepository.findConnectionByUserId(userId);
    
            const allMeetings = await this.accountabilityRepository.findAllThisWeekMeetings(userId);
    
            const userInfo = {
                name: profile?.name,
                email: user?.email,
                image: profile?.image,
                memberSince: profile?.memberSince,
                chapter: chapter?.name,
                region: chapter?.regionId?.name,
            };
    
            let nextMeeting = null;
            const meetings = await this.accountabilityRepository.getUpcomingAndNextMeeting(userId);
            if (Array.isArray(meetings) && meetings.length > 0) {
                nextMeeting = meetings[0];
            }
    
            const totalConnections = Array.isArray(connections) && connections.length > 0 ? connections[0].connections : 0;
    
            return { userInfo, nextMeeting, connections: totalConnections, weeklyMeetings: allMeetings };
        } catch (error) {
            console.error("Error in getHomeProfile:", error);
            throw error;
        }
    }
    
}
