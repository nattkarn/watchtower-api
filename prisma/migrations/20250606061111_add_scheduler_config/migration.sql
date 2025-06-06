-- CreateTable
CREATE TABLE "SchedulerConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "jobName" TEXT NOT NULL DEFAULT 'url-health-check',
    "cronExpr" TEXT NOT NULL DEFAULT '*/15 * * * *',
    "updatedById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchedulerConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchedulerConfig_jobName_key" ON "SchedulerConfig"("jobName");

-- AddForeignKey
ALTER TABLE "SchedulerConfig" ADD CONSTRAINT "SchedulerConfig_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
