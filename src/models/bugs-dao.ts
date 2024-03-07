import { db } from "./database";
import { Bug, BugUpdate, NewBug } from "./database-types";

export async function getAll(): Promise<Bug[]> {
  return db.selectFrom("bugs").selectAll().execute();
}

export async function get(id: number): Promise<Bug | undefined> {
  return await db
    .selectFrom("bugs")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function create(newBug: NewBug): Promise<Bug> {
  return await db
    .insertInto("bugs")
    .values(newBug)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function update(
  id: number,
  update: BugUpdate
): Promise<Bug | undefined> {
  return await db
    .updateTable("bugs")
    .set(update)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteBug(id: number) {
  return await db.deleteFrom("bugs").where("id", "=", id).executeTakeFirst();
}
