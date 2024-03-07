import { z } from "zod";

export { BugStatus, BugPriority, newBugSchema, bugUpdateSchema };

const bugStatusSchema = z.enum([
  "New",
  "Acknowledged",
  "Assigned",
  "Blocked",
  "Resolved",
]);

type BugStatus = z.infer<typeof bugStatusSchema>;

const bugPrioritySchema = z.enum(["NoPriority", "Low", "Medium", "High"]);

type BugPriority = z.infer<typeof bugPrioritySchema>;

const newBugSchema = z.object({
  name: z.string(),
  description: z.string(),
  priority: bugPrioritySchema,
});

const bugUpdateSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    status: bugStatusSchema,
    priority: bugPrioritySchema,
  })
  .partial();
