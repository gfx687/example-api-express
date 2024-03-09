import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { z } from "zod";

export {
  BugsTable,
  Bug,
  NewBug,
  BugUpdate,
  BugStatus,
  BugPriority,
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

interface BugsTable {
  id: ColumnType<number, never, never>;
  name: string;
  description: string;
  status: BugStatus;
  priority: BugPriority;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, Date>;
}

type Bug = Selectable<BugsTable>;

type NewBug = Insertable<BugsTable>;

const newBugSchema = z.object({
  name: z.string(),
  description: z.string(),
  priority: bugPrioritySchema,
});

type BugUpdate = Updateable<BugsTable>;

const bugUpdateSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    status: bugStatusSchema,
    priority: bugPrioritySchema,
  })
  .partial();
