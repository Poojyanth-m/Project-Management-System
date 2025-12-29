/*
  Warnings:

  - You are about to drop the column `title` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('HUMAN', 'EQUIPMENT', 'SOFTWARE', 'VENUE');

-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- DropIndex
DROP INDEX "notifications_status_idx";

-- DropIndex
DROP INDEX "notifications_userId_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "title";

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL DEFAULT 'HUMAN',
    "status" "ResourceStatus" NOT NULL DEFAULT 'ACTIVE',
    "availability" INTEGER NOT NULL DEFAULT 100,
    "costPH" DOUBLE PRECISION,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_allocations" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "taskId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "allocationPercentage" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resources_projectId_idx" ON "resources"("projectId");

-- CreateIndex
CREATE INDEX "resources_type_idx" ON "resources"("type");

-- CreateIndex
CREATE INDEX "resource_allocations_resourceId_idx" ON "resource_allocations"("resourceId");

-- CreateIndex
CREATE INDEX "resource_allocations_projectId_idx" ON "resource_allocations"("projectId");

-- CreateIndex
CREATE INDEX "resource_allocations_taskId_idx" ON "resource_allocations"("taskId");

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_allocations" ADD CONSTRAINT "resource_allocations_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_allocations" ADD CONSTRAINT "resource_allocations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_allocations" ADD CONSTRAINT "resource_allocations_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
