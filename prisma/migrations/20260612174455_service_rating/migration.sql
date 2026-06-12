-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'SERVICE_RATED';

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "rating" INTEGER;
