import { Bug, BugUpdate, NewBug } from "./bugs-types";

const database: Bug[] = [
  {
    id: 1,
    name: "seed bug",
    description: "seeded bug for testing purposes",
    status: "Acknowledged",
    priority: "NoPriority",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function getAll(): Bug[] {
  return database;
}

export function get(id: number): Bug | undefined {
  return database.find((x) => x.id == id);
}

export function create(newBug: NewBug): Bug {
  const bug: Bug = {
    id: database[-1].id + 1,
    name: newBug.name,
    description: newBug.description,
    status: "Acknowledged",
    priority: newBug.priority,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  database.push(bug);
  return bug;
}

export function update(id: number, update: BugUpdate): Bug | undefined {
  const bug = get(id);
  if (!bug) {
    return undefined;
  }

  let updated = false;
  if (update.name) {
    bug.name = update.name;
    updated = true;
  }
  if (update.description) {
    bug.description = update.description;
    updated = true;
  }
  if (update.status) {
    updated = true;
    bug.status = update.status;
  }
  if (update.priority) {
    bug.priority = update.priority;
    updated = true;
  }
  if (updated) {
    bug.updatedAt = new Date();
  }

  return bug;
}

export function deleteBug(id: number) {
  const idx = database.findIndex((x) => x.id == id);
  if (idx == -1) {
    return;
  }

  database.splice(idx, 1);
}
