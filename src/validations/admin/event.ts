import { z } from "zod";

const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().min(1,"Date is required"),
  // time: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  place: z.string().min(1, "Place is required"),
  location: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),
  audienceType: z.enum(["selected", "all"]),
  chapterId: z.string().optional(), // can be optional if not always provided
  attendees: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.every((id) => typeof id === "string");
    } catch {
      return false;
    }
  }, { message: "Attendees must be a JSON string of an array of strings" }),
  customFields: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return typeof parsed === "object" && !Array.isArray(parsed);
    } catch {
      return false;
    }
  }, { message: "Custom fields must be a JSON string of an object" }),
});

export default eventSchema;
