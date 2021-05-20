/*
  Warnings:

  - You are about to drop the column `userFriendId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FriendMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_userId_fkey";

-- DropForeignKey
ALTER TABLE "FriendMessage" DROP CONSTRAINT "FriendMessage_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "FriendMessage" DROP CONSTRAINT "FriendMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMessage" DROP CONSTRAINT "GroupMessage_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMessage" DROP CONSTRAINT "GroupMessage_senderGroupId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_userFriendId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "userFriendId";

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "FriendMessage";

-- DropTable
DROP TABLE "GroupMessage";

-- CreateTable
CREATE TABLE "user_friends" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "friendId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "groupId" TEXT,
    "content" TEXT NOT NULL,
    "type" "ContentType" NOT NULL DEFAULT E'TEXT',
    "messageType" "MessageType" NOT NULL DEFAULT E'GROUP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_messages" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "ContentType" NOT NULL DEFAULT E'TEXT',
    "messageType" "MessageType" NOT NULL DEFAULT E'FRIEND',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_groupMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_groupMembers_AB_unique" ON "_groupMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_groupMembers_B_index" ON "_groupMembers"("B");

-- AddForeignKey
ALTER TABLE "user_friends" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_friends" ADD FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_messages" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_messages" ADD FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_messages" ADD FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_messages" ADD FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_groupMembers" ADD FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_groupMembers" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
