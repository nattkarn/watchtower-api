/*
  Warnings:

  - You are about to drop the `SchedulerConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SchedulerConfig" DROP CONSTRAINT "SchedulerConfig_updatedById_fkey";

-- DropTable
DROP TABLE "SchedulerConfig";

-- CreateTable
CREATE TABLE "AlertLog" (
    "id" SERIAL NOT NULL,
    "urlId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AlertLog" ADD CONSTRAINT "AlertLog_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
