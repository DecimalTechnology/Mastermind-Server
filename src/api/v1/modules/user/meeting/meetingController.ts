import { NextFunction, Request, Response } from "express";
import User from "../../../../../models/userModel";
import { BadRequestError, NotFoundError } from "../../../../../constants/customErrors";
import { Chapter } from "../../../../../models/chapterModal";
import mongoose from "mongoose";
import MeetingModel from "../../../../../models/MeetingModel";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
import { MeetingServices } from "./meetingServices";

export class MeetingController {


    constructor(meetingServices:MeetingServices){

    }
    getAllUserMeetings = async (req: Request, res: Response, next: NextFunction) => {
        try {

            
            const { type, date } = req.query;
            const userId = req.userId;

            const user = await User.findById(userId);
            if (!user) throw new NotFoundError("User not found");

            const chapter = await Chapter.findById(user.chapter);
            if (!chapter) throw new NotFoundError("Chapter not found");
            if (!type) throw new BadRequestError("Type is required");
            if (!["all", "chapter", "region", "local", "nation"].includes(type as string)) throw new BadRequestError("Invalid type");
            const findArr = [chapter._id, chapter.localId, chapter.regionId, chapter.nationId].filter(Boolean);

            let filterArr: any[] = [];

            if (type === "all") filterArr = findArr;
            if (type === "chapter") filterArr = [chapter._id];
            if (type === "local") filterArr = [chapter.localId];
            if (type === "region") filterArr = [chapter.regionId];
            if (type === "nation") filterArr = [chapter.nationId];

            // 🔥 Build dynamic query object
            const query: any = {
                referenceId: { $in: filterArr },
            };

            // ✅ Date filter (if provided)
            if (date) {
                const selectedDate = new Date(date as string);

                query.dates = {
                    $elemMatch: {
                        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
                        $lte: new Date(selectedDate.setHours(23, 59, 59, 999)),
                    },
                };
            }

            const meetings = await MeetingModel.find(query);

            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Meetings fetched successfully",
                data: meetings,
            });
        } catch (error) {
            next(error);
        }
    };

    getMeetingById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { meetingId } = req.params;

            if (!meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) throw new BadRequestError("Invalid meeting Id");

            const meeting = await MeetingModel.findById(meetingId);

            if (!meeting) throw new NotFoundError("Meeting not found");

            res.status(STATUS_CODES.OK).json({ success: true, data: meeting });
        } catch (error) {
            next(error);
        }
    };
}
