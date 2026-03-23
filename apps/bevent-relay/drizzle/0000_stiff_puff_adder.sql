CREATE TYPE "public"."event_type_enum" AS ENUM('Message', 'Guard', 'Gift', 'SuperChat', 'SuperChatDelete', 'LiveStart', 'LiveEnd', 'LiveCutoff', 'LiveWarning', 'LikesUpdate', 'LikeClick', 'EntryEffect');--> statement-breakpoint
CREATE TYPE "public"."other_event_status_enum" AS ENUM('unknown', 'unimplemented', 'parsingFailed');--> statement-breakpoint
CREATE TABLE "event_configs_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_configs_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cmd" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_configs_table_cmd_unique" UNIQUE("cmd")
);
--> statement-breakpoint
CREATE TABLE "events_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" text NOT NULL,
	"type" text NOT NULL,
	"room_id" bigint NOT NULL,
	"data" jsonb,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_table_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "other_events_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "other_events_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cmd" text NOT NULL,
	"room_id" bigint NOT NULL,
	"status" "other_event_status_enum" DEFAULT 'unknown' NOT NULL,
	"raw" jsonb,
	"extra" jsonb,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rooms_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text,
	"room_id" bigint NOT NULL,
	"short_room_id" bigint,
	"uid" bigint,
	"uname" text,
	"face" text,
	"status" integer DEFAULT 0 NOT NULL,
	"news" text,
	"medal_name" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rooms_table_room_id_unique" UNIQUE("room_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "event_configs_id_idx" ON "event_configs_table" USING btree ("id");--> statement-breakpoint
CREATE INDEX "event_configs_cmd_idx" ON "event_configs_table" USING btree ("cmd");--> statement-breakpoint
CREATE INDEX "event_configs_created_at_idx" ON "event_configs_table" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "events_id_idx" ON "events_table" USING btree ("id");--> statement-breakpoint
CREATE INDEX "events_type_idx" ON "events_table" USING btree ("type");--> statement-breakpoint
CREATE INDEX "events_room_id_idx" ON "events_table" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "events_created_at_idx" ON "events_table" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "events_type_room_id_idx" ON "events_table" USING btree ("type","room_id");--> statement-breakpoint
CREATE INDEX "events_type_room_id_created_at_idx" ON "events_table" USING btree ("type","room_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "other_events_id_idx" ON "other_events_table" USING btree ("id");--> statement-breakpoint
CREATE INDEX "other_events_cmd_idx" ON "other_events_table" USING btree ("cmd");--> statement-breakpoint
CREATE INDEX "other_events_room_id_idx" ON "other_events_table" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "other_events_cmd_room_id_idx" ON "other_events_table" USING btree ("cmd","room_id");--> statement-breakpoint
CREATE INDEX "other_events_created_at_idx" ON "other_events_table" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "rooms_id_idx" ON "rooms_table" USING btree ("id");--> statement-breakpoint
CREATE INDEX "rooms_room_id_idx" ON "rooms_table" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "rooms_uid_idx" ON "rooms_table" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "rooms_created_at_idx" ON "rooms_table" USING btree ("created_at");