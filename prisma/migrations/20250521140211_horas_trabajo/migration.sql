/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Material` table. All the data in the column will be lost.
  - You are about to alter the column `cantidad` on the `Material` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Material" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "cantidad" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "HorasTrabajo" (
    "id" SERIAL NOT NULL,
    "horas" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "tareaId" INTEGER NOT NULL,

    CONSTRAINT "HorasTrabajo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HorasTrabajo" ADD CONSTRAINT "HorasTrabajo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorasTrabajo" ADD CONSTRAINT "HorasTrabajo_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
