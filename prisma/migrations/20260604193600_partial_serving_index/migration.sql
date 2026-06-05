-- منع أن يخدم حلاق أكثر من تذكرة واحدة في آنٍ واحد (partial unique index)
CREATE UNIQUE INDEX "uq_one_serving_per_barber"
  ON "tickets" ("barber_id")
  WHERE "status" = 'serving' AND "barber_id" IS NOT NULL;
