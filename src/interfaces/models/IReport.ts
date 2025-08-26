import { Document, Types } from "mongoose";
import { EventLevel, EventStatus } from "../../models/eventModel";


export interface IReport extends Document {
  file: string;

  eventId: Types.ObjectId;
  reportedBy: Types.ObjectId;

  status: EventStatus;

  reviewedBy?: Types.ObjectId;

  eventType: EventLevel;

  chapterId?: Types.ObjectId;
  localId?: Types.ObjectId;
  regionId?: Types.ObjectId;
  nationId?: Types.ObjectId;

  remarks: string;

  resubmissionCount: number;
  resubmittedAt?: Date;

  previousFile?: string;

  createdAt: Date;
  updatedAt: Date;
}
