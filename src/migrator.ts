import { FileMigrationProvider, Migrator } from "kysely";
import { db } from "./models/database";
import path from "path";
import { promises as fs } from "fs";
import logger from "./logger";

/**
 * Migrate to latest migration or exit entire app if failed
 */
export async function migrateOrPanic() {
  const log = logger.child({
    source: "migrator",
    traceId: crypto.randomUUID(),
  });

  const migrator = new Migrator({
    db: db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      log.info(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      log.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    log.fatal({ err: error }, "failed to migrate");
    await db.destroy();
    process.exit(1);
  }

  log.info(`migrated successfully. Migrations run: ${results?.length}`);
}
