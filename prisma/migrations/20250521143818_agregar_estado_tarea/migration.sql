/*
  Warnings:

  - You are about to alter the column `horas` on the `HorasTrabajo` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `completada` on the `Tarea` table. All the data in the column will be lost.
  - You are about to drop the column `creadaEn` on the `Tarea` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA');

-- AlterTable
ALTER TABLE "HorasTrabajo" ALTER COLUMN "horas" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Tarea" DROP COLUMN "completada",
DROP COLUMN "creadaEn",
ADD COLUMN     "estado" "Estado" NOT NULL DEFAULT 'PENDIENTE';
