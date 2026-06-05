-- CreateEnum
CREATE TYPE "CountdownMode" AS ENUM ('auto', 'manual');

-- AlterTable
ALTER TABLE "shop_settings" ADD COLUMN     "countdown_mode" "CountdownMode" NOT NULL DEFAULT 'auto';

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "ready_at" TIMESTAMP(3);
