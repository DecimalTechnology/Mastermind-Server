import { z } from 'zod';

export const chapterSchema = z.object({
  name: z.string().min(1, "Chapter name is required"),
  description: z.string().optional(),
  nation: z.string().min(1, "Nation is required"),
  region: z.string().min(1, "Region is required"),
  local: z.string().min(1, "Local is required"),
  members: z.array(z.string()), // Array of user IDs or names, adjust accordingly
  coreTeam: z.array(z.string()).max(3, "Maximum 3 core team members allowed"), // limit if you want
  createdBy: z.string(), // Usually this would be the user ID who created the chapter
});
