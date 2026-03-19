ALTER TABLE "events_table" ALTER COLUMN "cmd" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events_table" ALTER COLUMN "room_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events_table" ADD COLUMN "parsed" jsonb;