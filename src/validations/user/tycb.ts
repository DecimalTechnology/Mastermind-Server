import { z } from "zod";

export const BusinessTypeEnum = z.enum(["new", "repeat"]);

export const createTYCBZodSchema = z.object({
  fromUser: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  toUser: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  message: z.string().min(1, "Message is required"),
  businessType: BusinessTypeEnum,
  amount: z.number().positive("Amount must be a positive number")
});
