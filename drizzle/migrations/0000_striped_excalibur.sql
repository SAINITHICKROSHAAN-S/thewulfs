CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" timestamp DEFAULT now(),
	"status" text NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"items" jsonb NOT NULL
);
