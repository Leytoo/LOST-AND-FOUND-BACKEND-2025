-- AlterTable
ALTER TABLE "LostItem" ADD COLUMN     "isFound" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "LostItem_isFound_idx" ON "LostItem"("isFound");
