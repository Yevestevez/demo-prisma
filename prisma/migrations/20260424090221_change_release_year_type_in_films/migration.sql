/*
  Warnings:

  - Changed the type of `release_year` on the `films` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "films" DROP COLUMN "release_year",
ADD COLUMN     "release_year" INTEGER NOT NULL;
