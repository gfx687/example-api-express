import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { BugPriority, BugStatus } from "./bugs-types";

export interface Database {
  bugs: BugsTable;
}

export interface BugsTable {
  id: ColumnType<number, never, never>;
  name: string;
  description: string;
  status: BugStatus;
  priority: BugPriority;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, Date>;
}

export type Bug = Selectable<BugsTable>;
export type NewBug = Insertable<BugsTable>;
export type BugUpdate = Updateable<BugsTable>;
