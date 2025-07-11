/*
  Warnings:

  - Added the required column `updatedDate` to the `Announcement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "updatedDate" TIMESTAMP(3) NOT NULL;
