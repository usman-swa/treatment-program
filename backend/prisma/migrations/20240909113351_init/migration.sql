/*
  Warnings:

  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Program` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_programId_fkey";

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "Program";

-- CreateTable
CREATE TABLE "TreatmentProgram" (
    "id" SERIAL NOT NULL,
    "weekday" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,

    CONSTRAINT "TreatmentProgram_pkey" PRIMARY KEY ("id")
);
