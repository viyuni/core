CREATE TABLE "events_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cmd" text,
	"room_id" text,
	"data" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX "id_idx" ON "events_table" USING btree ("id");--> statement-breakpoint
CREATE INDEX "cmd_idx" ON "events_table" USING btree ("cmd");--> statement-breakpoint
CREATE INDEX "roomId_idx" ON "events_table" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "createdAt_idx" ON "events_table" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "cmd_roomId_idx" ON "events_table" USING btree ("cmd","room_id");--> statement-breakpoint
CREATE INDEX "cmd_roomId_createdAt_idx" ON "events_table" USING btree ("cmd","room_id","created_at");