/*
  Warnings:

  - You are about to drop the column `senderGroupId` on the `GroupMessage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupMessage" DROP CONSTRAINT "GroupMessage_senderGroupId_fkey";

-- AlterTable
ALTER TABLE "GroupMessage" DROP COLUMN "senderGroupId",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
