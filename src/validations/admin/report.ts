import mongoose from 'mongoose';
import {z} from 'zod'
import { EventLevel, EventStatus } from '../../models/eventModel';
export const reportValidator = z.object({
  file: z.string().optional(),

  eventId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid event ID",
  }),

  reportedBy: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid reporter ID",
  }),

  status: z.nativeEnum(EventStatus).optional(), // default handled by Mongoose

  reviewedBy: z
    .string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid reviewer ID",
    })
    .optional(),

  eventType: z.nativeEnum(EventLevel).optional(),

  chapterId: z
    .string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid chapter ID",
    })
    .optional(),

  localId: z
    .string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid local ID",
    })
    .optional(),

  regionId: z
    .string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid region ID",
    })
    .optional(),

  nationId: z
    .string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid nation ID",
    })
    .optional(),

  remarks: z.string().optional(),

  resubmissionCount: z.number().optional(),

  resubmittedAt: z.date().optional(),

  previousFile: z.string().optional(),
});
