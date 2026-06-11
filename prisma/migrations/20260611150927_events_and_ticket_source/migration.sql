-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('QR_SCANNED', 'WAIT_PAGE_OPENED', 'WAIT_PAGE_REVISITED', 'TICKET_CREATED', 'TICKET_CANCELLED', 'TICKET_CALLED', 'SERVICE_STARTED', 'SERVICE_COMPLETED', 'NO_SHOW', 'APPOINTMENT_CREATED');

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "source" TEXT;

-- CreateTable
CREATE TABLE "events" (
    "id" BIGSERIAL NOT NULL,
    "type" "EventType" NOT NULL,
    "shop_id" BIGINT,
    "ticket_id" BIGINT,
    "visitor_id" TEXT,
    "source" TEXT,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_type_created_at_idx" ON "events"("type", "created_at");

-- CreateIndex
CREATE INDEX "events_shop_id_created_at_idx" ON "events"("shop_id", "created_at");

-- CreateIndex
CREATE INDEX "events_ticket_id_idx" ON "events"("ticket_id");
