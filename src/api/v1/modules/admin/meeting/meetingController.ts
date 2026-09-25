import { NextFunction, Request, Response } from "express";
import User from "../../../../../models/userModel";
import { IUser } from "../../../../../interfaces/models/IUser";
import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import MeetingModel from "../../../../../models/MeetingModel";
import mongoose from "mongoose";
import { Chapter } from "../../../../../models/chapterModal";
export class MeetingController {
    constructor() {}

    createMeeting = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { dates, meetingType, location } = req.body;

            if (!["Local", "Region", "Nation", "Chapter"].includes(meetingType)) throw new BadRequestError("Invalid meeting type");

            if (!location) throw new BadRequestError("Location is required");

            if (!dates || dates.length === 0) throw new BadRequestError("Provide at least one date");

            const userId = req.adminId;

            const user: any = await User.findById(userId);
            if (!user) throw new NotFoundError("User not found");

            let referenceId = Object.values(user.manage)[0];
            if (req.body.referenceId && mongoose.Types.ObjectId.isValid(req.body.referenceId)) {
                referenceId = new mongoose.Types.ObjectId(req.body.referenceId as string);
            }

            // ✅ Convert to Date objects and sort ascending (nearest first)
            const sortedDates = dates.map((d: string) => new Date(d)).sort((a: Date, b: Date) => a.getTime() - b.getTime());

            const newMeeting = await MeetingModel.create({
                ...req.body,
                dates: sortedDates,
                createdBy: user._id,
                referenceId: referenceId,
            });

            res.status(STATUS_CODES.CREATED).json({
                success: true,
                data: newMeeting,
            });
        } catch (error) {
            next(error);
        }
    };

    getAllMeeting = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { search = "", page = "1", limit = "10", filter, meetingType, referenceId } = req.query;

            const pageNumber = parseInt(page as string);
            const limitNumber = parseInt(limit as string);
            const skip = (pageNumber - 1) * limitNumber;

            const dataFilter: any = {};

            if (search) {
                dataFilter.location = {
                    $regex: search,
                    $options: "i",
                };
            }

            if (filter == "Ended") dataFilter["status"] = "Ended";
            if (filter == "Upcoming") dataFilter["status"] = "Upcoming";
            if (filter == "Next") dataFilter["status"] = "Next";

            if (meetingType) {
                dataFilter.meetingType = meetingType;
            }

            if (referenceId) {
                if (typeof referenceId === "string" && referenceId.includes(",")) {
                    dataFilter.referenceId = { $in: referenceId.split(",").map(id => new mongoose.Types.ObjectId(id.trim())) };
                } else if (mongoose.Types.ObjectId.isValid(referenceId as string)) {
                    dataFilter.referenceId = new mongoose.Types.ObjectId(referenceId as string);
                }
            }

            const meetings = await MeetingModel.find(dataFilter).sort({ createdAt: -1 }).skip(skip).limit(limitNumber);

            const totalDocuments = await MeetingModel.countDocuments(dataFilter);

            res.status(200).json({
                success: true,
                data: meetings,
                currentPage: pageNumber,
                totalPages: totalDocuments,
            });
        } catch (error) {
            next(error);
        }
    };

    updateMeetings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { meetingId } = req.params;

            const newMeeting = await MeetingModel.findByIdAndUpdate(meetingId, req.body, { new: true });
            res.status(STATUS_CODES.CREATED).json({ success: true, data: newMeeting });
        } catch (error) {
            next(error);
        }
    };
    deleteMeeting = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { meetingId } = req.params;

            if (!meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) throw new BadRequestError("Invalid Meeting Id");
            const meeting = await MeetingModel.findByIdAndDelete(meetingId);
            if (!meeting) throw new NotFoundError("Meeting not found");
            res.status(STATUS_CODES.CREATED).json({ success: true, data: meeting });
        } catch (error) {
            next(error);
        }
    };
    getMeetingById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { meetingId } = req.params;

            if (!meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) throw new BadRequestError("Meeting Invalid meeting Id");

            const meeting = await MeetingModel.findById(meetingId);
            if (!meeting) throw new NotFoundError("Meeting not found");

            let members: any[] = [];
            if (meeting.meetingType === "Chapter") {
                members = await User.find({ chapter: meeting.referenceId }, { name: 1 });
            } else if (meeting.meetingType === "Local") {
                const chapters = await Chapter.find({ localId: meeting.referenceId });
                const chapterIds = chapters.map(c => c._id);
                members = await User.find({ chapter: { $in: chapterIds } }, { name: 1 });
            }

            res.status(STATUS_CODES.OK).json({ success: true, message: "", meeting, members });
        } catch (error) {
            next(error);
        }
    };
    saveAttendence = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { meetingId } = req.params;
         
            if (!meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) throw new BadRequestError("Meeting Invalid meeting Id");

            const meeting: any = await MeetingModel.findById(meetingId);
            if (!meeting) throw new NotFoundError("Meeting not found");

            meeting.participants = req.body;

            await meeting?.save();

            res.status(STATUS_CODES.OK).json({ success: true, message: "", meeting });
        } catch (error) {
            next(error);
        }
    };
}
