-- Destructive: drop edad, add fecha_nacimiento (existing data is not migrated)
ALTER TABLE "Player" DROP COLUMN "edad";
ALTER TABLE "Player" ADD COLUMN "fecha_nacimiento" DATE;
