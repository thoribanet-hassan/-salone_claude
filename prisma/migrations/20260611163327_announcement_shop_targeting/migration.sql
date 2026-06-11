-- DropIndex
DROP INDEX "announcements_placement_key";

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "shop_ids" BIGINT[] DEFAULT ARRAY[]::BIGINT[];

-- CreateIndex
CREATE INDEX "announcements_is_active_placement_idx" ON "announcements"("is_active", "placement");
