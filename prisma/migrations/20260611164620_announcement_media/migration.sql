-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video');

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "media_type" "MediaType",
ADD COLUMN     "media_url" TEXT;
