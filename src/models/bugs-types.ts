import { z } from "zod";

export {
  BugStatus,
  BugPriority,
  Bug,
  NewBug,
  BugUpdate,
  bugStatusSchema,
  bugPrioritySchema,
  bugSchema,
  newBugSchema,
  bugUpdateSchema,
};

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

const bugSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  status: bugStatusSchema,
  priority: bugPrioritySchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

type Bug = z.infer<typeof bugSchema>;

const newBugSchema = bugSchema.pick({
  name: true,
  description: true,
  priority: true,
});

type NewBug = z.infer<typeof newBugSchema>;

const bugUpdateSchema = bugSchema
  .pick({
    name: true,
    description: true,
    status: true,
    priority: true,
  })
  .partial();

type BugUpdate = z.infer<typeof bugUpdateSchema>;
