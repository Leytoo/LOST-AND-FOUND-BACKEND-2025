-- AlterTable
ALTER TABLE "FoundItem" ADD COLUMN     "claimedAt" TIMESTAMP(3),
ADD COLUMN     "isFound" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE INDEX "FoundItem_status_idx" ON "FoundItem"("status");

-- CreateIndex
CREATE INDEX "FoundItem_isFound_idx" ON "FoundItem"("isFound");
