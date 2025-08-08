import { z } from "zod";

export const GoalSchema = z.object({
  goal: z.string().trim().min(1, "Goal is required"),
  target: z.string(),
  achieved: z.string()
});

export type Goal = z.infer<typeof GoalSchema>;
