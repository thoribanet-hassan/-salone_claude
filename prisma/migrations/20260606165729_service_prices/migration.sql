-- AlterTable
ALTER TABLE "services" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "shop_settings" ADD COLUMN     "show_prices" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "total_price" INTEGER NOT NULL DEFAULT 0;
