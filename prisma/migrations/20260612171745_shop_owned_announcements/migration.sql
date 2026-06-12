-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "owner_shop_id" BIGINT;

-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "can_self_announce" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "announcements_owner_shop_id_idx" ON "announcements"("owner_shop_id");
