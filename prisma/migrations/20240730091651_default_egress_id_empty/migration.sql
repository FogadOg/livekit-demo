-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL,
    "egressId" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Room" ("egressId", "id", "name", "password", "public") SELECT "egressId", "id", "name", "password", "public" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
