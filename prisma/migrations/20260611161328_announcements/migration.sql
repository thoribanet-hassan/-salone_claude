-- CreateEnum
CREATE TYPE "AnnouncementPlacement" AS ENUM ('all', 'home', 'join', 'ticket', 'dashboard', 'serve');

-- CreateTable
CREATE TABLE "announcements" (
    "id" BIGSERIAL NOT NULL,
    "placement" "AnnouncementPlacement" NOT NULL,
    "text" TEXT NOT NULL,
    "link_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "announcements_placement_key" ON "announcements"("placement");
