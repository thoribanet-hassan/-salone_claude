-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('male_barber', 'female_salon');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('basic', 'pro', 'premium', 'enterprise');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('manager', 'barber');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('available', 'unavailable', 'busy');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('waiting', 'serving', 'skipped', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "shops" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "facility_type" "FacilityType" NOT NULL,
    "shop_code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'basic',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Riyadh',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_settings" (
    "shop_id" BIGINT NOT NULL,
    "show_expected_time" BOOLEAN NOT NULL DEFAULT true,
    "show_people_ahead" BOOLEAN NOT NULL DEFAULT true,
    "show_barber_name" BOOLEAN NOT NULL DEFAULT true,
    "show_countdown" BOOLEAN NOT NULL DEFAULT true,
    "is_open" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "shop_settings_pkey" PRIMARY KEY ("shop_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "shop_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password_hash" TEXT,
    "login_code" TEXT,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'available',
    "avg_service_time" INTEGER NOT NULL DEFAULT 20,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" BIGSERIAL NOT NULL,
    "public_token" TEXT NOT NULL,
    "shop_id" BIGINT NOT NULL,
    "barber_id" BIGINT,
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT,
    "service_date" DATE NOT NULL,
    "ticket_number" INTEGER NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'waiting',
    "position" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_counters" (
    "shop_id" BIGINT NOT NULL,
    "service_date" DATE NOT NULL,
    "last_number" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ticket_counters_pkey" PRIMARY KEY ("shop_id","service_date")
);

-- CreateIndex
CREATE UNIQUE INDEX "shops_shop_code_key" ON "shops"("shop_code");

-- CreateIndex
CREATE UNIQUE INDEX "shops_slug_key" ON "shops"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_shop_id_role_status_idx" ON "users"("shop_id", "role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "users_shop_id_login_code_key" ON "users"("shop_id", "login_code");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_public_token_key" ON "tickets"("public_token");

-- CreateIndex
CREATE INDEX "tickets_shop_id_status_created_at_idx" ON "tickets"("shop_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "tickets_barber_id_status_created_at_idx" ON "tickets"("barber_id", "status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_shop_id_service_date_ticket_number_key" ON "tickets"("shop_id", "service_date", "ticket_number");

-- AddForeignKey
ALTER TABLE "shop_settings" ADD CONSTRAINT "shop_settings_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_counters" ADD CONSTRAINT "ticket_counters_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
