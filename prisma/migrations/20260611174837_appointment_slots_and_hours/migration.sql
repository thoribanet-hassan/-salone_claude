-- AlterTable
ALTER TABLE "shop_settings" ADD COLUMN     "appointment_grace_minutes" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "close_time" TEXT NOT NULL DEFAULT '22:00',
ADD COLUMN     "open_time" TEXT NOT NULL DEFAULT '09:00',
ADD COLUMN     "slot_minutes" INTEGER NOT NULL DEFAULT 30;
