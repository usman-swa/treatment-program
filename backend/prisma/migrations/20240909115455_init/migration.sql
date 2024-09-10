/*
  Warnings:

  - Added the required column `week` to the `TreatmentProgram` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TreatmentProgram" ADD COLUMN     "week" TEXT NOT NULL;
