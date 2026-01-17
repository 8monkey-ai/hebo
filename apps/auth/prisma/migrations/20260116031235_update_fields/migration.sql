/*
  Warnings:

  - You are about to drop the `teamMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "teamMembers" DROP CONSTRAINT "teamMembers_teamId_fkey";

-- DropForeignKey
ALTER TABLE "teamMembers" DROP CONSTRAINT "teamMembers_userId_fkey";

-- DropTable
DROP TABLE "teamMembers";

-- CreateTable
CREATE TABLE "teammembers" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teammembers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "teammembers_teamId_idx" ON "teammembers"("teamId");

-- CreateIndex
CREATE INDEX "teammembers_userId_idx" ON "teammembers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teammembers_teamId_userId_key" ON "teammembers"("teamId", "userId");

-- AddForeignKey
ALTER TABLE "teammembers" ADD CONSTRAINT "teammembers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teammembers" ADD CONSTRAINT "teammembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
