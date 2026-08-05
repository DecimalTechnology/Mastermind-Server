import { z } from "zod";

export const userRegistrationSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
   
    chapter: z.string().min(1, { message: "Chapter is required" }),
});

// ✅ Example use
const result = userRegistrationSchema.safeParse({
    name: "Adarsh",
    email: "adarsh@example.com",
    phoneNumber: "9876543210",
    chapter: "React Basics",
});
