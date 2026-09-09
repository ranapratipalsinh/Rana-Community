import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'hi', 'gu');
  CREATE TYPE "public"."enum__villages_v_published_locale" AS ENUM('en', 'hi', 'gu');
  CREATE TYPE "public"."enum__family_members_v_published_locale" AS ENUM('en', 'hi', 'gu');
  CREATE TYPE "public"."enum__family_relationships_v_published_locale" AS ENUM('en', 'hi', 'gu');
  CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('en', 'hi', 'gu');
  CREATE TYPE "public"."enum__news_v_published_locale" AS ENUM('en', 'hi', 'gu');
  CREATE TYPE "public"."enum__gallery_items_v_published_locale" AS ENUM('en', 'hi', 'gu');
  CREATE TYPE "public"."enum__committee_members_v_published_locale" AS ENUM('en', 'hi', 'gu');
  CREATE TYPE "public"."enum__documents_v_published_locale" AS ENUM('en', 'hi', 'gu');
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "villages_important_places_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "villages_locales" (
  	"name" varchar,
  	"short_description" varchar,
  	"description" jsonb,
  	"history" jsonb,
  	"location_address" varchar,
  	"population_info" varchar,
  	"contact_info_address" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_villages_v_version_important_places_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_villages_v_locales" (
  	"version_name" varchar,
  	"version_short_description" varchar,
  	"version_description" jsonb,
  	"version_history" jsonb,
  	"version_location_address" varchar,
  	"version_population_info" varchar,
  	"version_contact_info_address" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "family_members_locales" (
  	"full_name" varchar,
  	"short_biography" varchar,
  	"notes" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_family_members_v_locales" (
  	"version_full_name" varchar,
  	"version_short_biography" varchar,
  	"version_notes" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events_locales" (
  	"title" varchar,
  	"location" varchar,
  	"description" jsonb,
  	"registration_contact_name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v_locales" (
  	"version_title" varchar,
  	"version_location" varchar,
  	"version_description" jsonb,
  	"version_registration_contact_name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_news_v_locales" (
  	"version_title" varchar,
  	"version_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "gallery_items_locales" (
  	"video_url" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_gallery_items_v_locales" (
  	"version_video_url" varchar,
  	"version_caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "committee_members_locales" (
  	"name" varchar,
  	"position" varchar,
  	"short_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_committee_members_v_locales" (
  	"version_name" varchar,
  	"version_position" varchar,
  	"version_short_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "documents_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_documents_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_social_locales" (
  	"platform" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_locales" (
  	"site_name" varchar DEFAULT 'Rana Community Hub' NOT NULL,
  	"tagline" varchar,
  	"home_hero_heading" varchar,
  	"home_hero_subheading" varchar,
  	"home_intro_text" jsonb,
  	"home_history_heading" varchar DEFAULT 'Our History',
  	"home_history_content" jsonb,
  	"about_introduction" jsonb,
  	"about_history_and_background" jsonb,
  	"about_vision_and_mission" jsonb,
  	"about_objectives" jsonb,
  	"about_heritage_and_culture" jsonb,
  	"about_achievements" jsonb,
  	"contact_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX "villages_name_idx";
  DROP INDEX "_villages_v_version_version_name_idx";
  ALTER TABLE "_villages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_villages_v" ADD COLUMN "published_locale" "enum__villages_v_published_locale";
  ALTER TABLE "_family_members_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_family_members_v" ADD COLUMN "published_locale" "enum__family_members_v_published_locale";
  ALTER TABLE "_family_relationships_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_family_relationships_v" ADD COLUMN "published_locale" "enum__family_relationships_v_published_locale";
  ALTER TABLE "_events_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_events_v" ADD COLUMN "published_locale" "enum__events_v_published_locale";
  ALTER TABLE "_news_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_news_v" ADD COLUMN "published_locale" "enum__news_v_published_locale";
  ALTER TABLE "_gallery_items_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_gallery_items_v" ADD COLUMN "published_locale" "enum__gallery_items_v_published_locale";
  ALTER TABLE "_committee_members_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_committee_members_v" ADD COLUMN "published_locale" "enum__committee_members_v_published_locale";
  ALTER TABLE "_documents_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_documents_v" ADD COLUMN "published_locale" "enum__documents_v_published_locale";
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "villages_important_places_locales" ADD CONSTRAINT "villages_important_places_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."villages_important_places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "villages_locales" ADD CONSTRAINT "villages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."villages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_villages_v_version_important_places_locales" ADD CONSTRAINT "_villages_v_version_important_places_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_villages_v_version_important_places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_villages_v_locales" ADD CONSTRAINT "_villages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_villages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "family_members_locales" ADD CONSTRAINT "family_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."family_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_family_members_v_locales" ADD CONSTRAINT "_family_members_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_family_members_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_locales" ADD CONSTRAINT "_news_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_items_locales" ADD CONSTRAINT "gallery_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_gallery_items_v_locales" ADD CONSTRAINT "_gallery_items_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_gallery_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "committee_members_locales" ADD CONSTRAINT "committee_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."committee_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_committee_members_v_locales" ADD CONSTRAINT "_committee_members_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_committee_members_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "documents_locales" ADD CONSTRAINT "documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_documents_v_locales" ADD CONSTRAINT "_documents_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_documents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_locales" ADD CONSTRAINT "site_settings_social_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "villages_important_places_locales_locale_parent_id_unique" ON "villages_important_places_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "villages_name_idx" ON "villages_locales" USING btree ("name","_locale");
  CREATE UNIQUE INDEX "villages_locales_locale_parent_id_unique" ON "villages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_villages_v_version_important_places_locales_locale_parent_i" ON "_villages_v_version_important_places_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_villages_v_version_version_name_idx" ON "_villages_v_locales" USING btree ("version_name","_locale");
  CREATE UNIQUE INDEX "_villages_v_locales_locale_parent_id_unique" ON "_villages_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "family_members_locales_locale_parent_id_unique" ON "family_members_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_family_members_v_locales_locale_parent_id_unique" ON "_family_members_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_news_v_locales_locale_parent_id_unique" ON "_news_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "gallery_items_locales_locale_parent_id_unique" ON "gallery_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_gallery_items_v_locales_locale_parent_id_unique" ON "_gallery_items_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "committee_members_locales_locale_parent_id_unique" ON "committee_members_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_committee_members_v_locales_locale_parent_id_unique" ON "_committee_members_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "documents_locales_locale_parent_id_unique" ON "documents_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_documents_v_locales_locale_parent_id_unique" ON "_documents_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_social_locales_locale_parent_id_unique" ON "site_settings_social_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_villages_v_snapshot_idx" ON "_villages_v" USING btree ("snapshot");
  CREATE INDEX "_villages_v_published_locale_idx" ON "_villages_v" USING btree ("published_locale");
  CREATE INDEX "_family_members_v_snapshot_idx" ON "_family_members_v" USING btree ("snapshot");
  CREATE INDEX "_family_members_v_published_locale_idx" ON "_family_members_v" USING btree ("published_locale");
  CREATE INDEX "_family_relationships_v_snapshot_idx" ON "_family_relationships_v" USING btree ("snapshot");
  CREATE INDEX "_family_relationships_v_published_locale_idx" ON "_family_relationships_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_news_v_snapshot_idx" ON "_news_v" USING btree ("snapshot");
  CREATE INDEX "_news_v_published_locale_idx" ON "_news_v" USING btree ("published_locale");
  CREATE INDEX "_gallery_items_v_snapshot_idx" ON "_gallery_items_v" USING btree ("snapshot");
  CREATE INDEX "_gallery_items_v_published_locale_idx" ON "_gallery_items_v" USING btree ("published_locale");
  CREATE INDEX "_committee_members_v_snapshot_idx" ON "_committee_members_v" USING btree ("snapshot");
  CREATE INDEX "_committee_members_v_published_locale_idx" ON "_committee_members_v" USING btree ("published_locale");
  CREATE INDEX "_documents_v_snapshot_idx" ON "_documents_v" USING btree ("snapshot");
  CREATE INDEX "_documents_v_published_locale_idx" ON "_documents_v" USING btree ("published_locale");
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "villages_important_places" DROP COLUMN "name";
  ALTER TABLE "villages_important_places" DROP COLUMN "description";
  ALTER TABLE "villages" DROP COLUMN "name";
  ALTER TABLE "villages" DROP COLUMN "short_description";
  ALTER TABLE "villages" DROP COLUMN "description";
  ALTER TABLE "villages" DROP COLUMN "history";
  ALTER TABLE "villages" DROP COLUMN "location_address";
  ALTER TABLE "villages" DROP COLUMN "population_info";
  ALTER TABLE "villages" DROP COLUMN "contact_info_address";
  ALTER TABLE "villages" DROP COLUMN "meta_title";
  ALTER TABLE "villages" DROP COLUMN "meta_description";
  ALTER TABLE "_villages_v_version_important_places" DROP COLUMN "name";
  ALTER TABLE "_villages_v_version_important_places" DROP COLUMN "description";
  ALTER TABLE "_villages_v" DROP COLUMN "version_name";
  ALTER TABLE "_villages_v" DROP COLUMN "version_short_description";
  ALTER TABLE "_villages_v" DROP COLUMN "version_description";
  ALTER TABLE "_villages_v" DROP COLUMN "version_history";
  ALTER TABLE "_villages_v" DROP COLUMN "version_location_address";
  ALTER TABLE "_villages_v" DROP COLUMN "version_population_info";
  ALTER TABLE "_villages_v" DROP COLUMN "version_contact_info_address";
  ALTER TABLE "_villages_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_villages_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "family_members" DROP COLUMN "full_name";
  ALTER TABLE "family_members" DROP COLUMN "short_biography";
  ALTER TABLE "family_members" DROP COLUMN "notes";
  ALTER TABLE "_family_members_v" DROP COLUMN "version_full_name";
  ALTER TABLE "_family_members_v" DROP COLUMN "version_short_biography";
  ALTER TABLE "_family_members_v" DROP COLUMN "version_notes";
  ALTER TABLE "events" DROP COLUMN "title";
  ALTER TABLE "events" DROP COLUMN "location";
  ALTER TABLE "events" DROP COLUMN "description";
  ALTER TABLE "events" DROP COLUMN "registration_contact_name";
  ALTER TABLE "_events_v" DROP COLUMN "version_title";
  ALTER TABLE "_events_v" DROP COLUMN "version_location";
  ALTER TABLE "_events_v" DROP COLUMN "version_description";
  ALTER TABLE "_events_v" DROP COLUMN "version_registration_contact_name";
  ALTER TABLE "news" DROP COLUMN "title";
  ALTER TABLE "news" DROP COLUMN "description";
  ALTER TABLE "_news_v" DROP COLUMN "version_title";
  ALTER TABLE "_news_v" DROP COLUMN "version_description";
  ALTER TABLE "gallery_items" DROP COLUMN "video_url";
  ALTER TABLE "gallery_items" DROP COLUMN "caption";
  ALTER TABLE "_gallery_items_v" DROP COLUMN "version_video_url";
  ALTER TABLE "_gallery_items_v" DROP COLUMN "version_caption";
  ALTER TABLE "committee_members" DROP COLUMN "name";
  ALTER TABLE "committee_members" DROP COLUMN "position";
  ALTER TABLE "committee_members" DROP COLUMN "short_description";
  ALTER TABLE "_committee_members_v" DROP COLUMN "version_name";
  ALTER TABLE "_committee_members_v" DROP COLUMN "version_position";
  ALTER TABLE "_committee_members_v" DROP COLUMN "version_short_description";
  ALTER TABLE "documents" DROP COLUMN "title";
  ALTER TABLE "documents" DROP COLUMN "description";
  ALTER TABLE "_documents_v" DROP COLUMN "version_title";
  ALTER TABLE "_documents_v" DROP COLUMN "version_description";
  ALTER TABLE "site_settings_social" DROP COLUMN "platform";
  ALTER TABLE "site_settings" DROP COLUMN "site_name";
  ALTER TABLE "site_settings" DROP COLUMN "tagline";
  ALTER TABLE "site_settings" DROP COLUMN "home_hero_heading";
  ALTER TABLE "site_settings" DROP COLUMN "home_hero_subheading";
  ALTER TABLE "site_settings" DROP COLUMN "home_intro_text";
  ALTER TABLE "site_settings" DROP COLUMN "home_history_heading";
  ALTER TABLE "site_settings" DROP COLUMN "home_history_content";
  ALTER TABLE "site_settings" DROP COLUMN "about_introduction";
  ALTER TABLE "site_settings" DROP COLUMN "about_history_and_background";
  ALTER TABLE "site_settings" DROP COLUMN "about_vision_and_mission";
  ALTER TABLE "site_settings" DROP COLUMN "about_objectives";
  ALTER TABLE "site_settings" DROP COLUMN "about_heritage_and_culture";
  ALTER TABLE "site_settings" DROP COLUMN "about_achievements";
  ALTER TABLE "site_settings" DROP COLUMN "contact_address";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "villages_important_places_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "villages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_villages_v_version_important_places_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_villages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "family_members_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_family_members_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_gallery_items_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "committee_members_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_committee_members_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "documents_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_documents_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_social_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "villages_important_places_locales" CASCADE;
  DROP TABLE "villages_locales" CASCADE;
  DROP TABLE "_villages_v_version_important_places_locales" CASCADE;
  DROP TABLE "_villages_v_locales" CASCADE;
  DROP TABLE "family_members_locales" CASCADE;
  DROP TABLE "_family_members_v_locales" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "_events_v_locales" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "_news_v_locales" CASCADE;
  DROP TABLE "gallery_items_locales" CASCADE;
  DROP TABLE "_gallery_items_v_locales" CASCADE;
  DROP TABLE "committee_members_locales" CASCADE;
  DROP TABLE "_committee_members_v_locales" CASCADE;
  DROP TABLE "documents_locales" CASCADE;
  DROP TABLE "_documents_v_locales" CASCADE;
  DROP TABLE "site_settings_social_locales" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP INDEX "_villages_v_snapshot_idx";
  DROP INDEX "_villages_v_published_locale_idx";
  DROP INDEX "_family_members_v_snapshot_idx";
  DROP INDEX "_family_members_v_published_locale_idx";
  DROP INDEX "_family_relationships_v_snapshot_idx";
  DROP INDEX "_family_relationships_v_published_locale_idx";
  DROP INDEX "_events_v_snapshot_idx";
  DROP INDEX "_events_v_published_locale_idx";
  DROP INDEX "_news_v_snapshot_idx";
  DROP INDEX "_news_v_published_locale_idx";
  DROP INDEX "_gallery_items_v_snapshot_idx";
  DROP INDEX "_gallery_items_v_published_locale_idx";
  DROP INDEX "_committee_members_v_snapshot_idx";
  DROP INDEX "_committee_members_v_published_locale_idx";
  DROP INDEX "_documents_v_snapshot_idx";
  DROP INDEX "_documents_v_published_locale_idx";
  ALTER TABLE "media" ADD COLUMN "alt" varchar NOT NULL;
  ALTER TABLE "villages_important_places" ADD COLUMN "name" varchar;
  ALTER TABLE "villages_important_places" ADD COLUMN "description" varchar;
  ALTER TABLE "villages" ADD COLUMN "name" varchar;
  ALTER TABLE "villages" ADD COLUMN "short_description" varchar;
  ALTER TABLE "villages" ADD COLUMN "description" jsonb;
  ALTER TABLE "villages" ADD COLUMN "history" jsonb;
  ALTER TABLE "villages" ADD COLUMN "location_address" varchar;
  ALTER TABLE "villages" ADD COLUMN "population_info" varchar;
  ALTER TABLE "villages" ADD COLUMN "contact_info_address" varchar;
  ALTER TABLE "villages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "villages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "_villages_v_version_important_places" ADD COLUMN "name" varchar;
  ALTER TABLE "_villages_v_version_important_places" ADD COLUMN "description" varchar;
  ALTER TABLE "_villages_v" ADD COLUMN "version_name" varchar;
  ALTER TABLE "_villages_v" ADD COLUMN "version_short_description" varchar;
  ALTER TABLE "_villages_v" ADD COLUMN "version_description" jsonb;
  ALTER TABLE "_villages_v" ADD COLUMN "version_history" jsonb;
  ALTER TABLE "_villages_v" ADD COLUMN "version_location_address" varchar;
  ALTER TABLE "_villages_v" ADD COLUMN "version_population_info" varchar;
  ALTER TABLE "_villages_v" ADD COLUMN "version_contact_info_address" varchar;
  ALTER TABLE "_villages_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_villages_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "family_members" ADD COLUMN "full_name" varchar;
  ALTER TABLE "family_members" ADD COLUMN "short_biography" varchar;
  ALTER TABLE "family_members" ADD COLUMN "notes" varchar;
  ALTER TABLE "_family_members_v" ADD COLUMN "version_full_name" varchar;
  ALTER TABLE "_family_members_v" ADD COLUMN "version_short_biography" varchar;
  ALTER TABLE "_family_members_v" ADD COLUMN "version_notes" varchar;
  ALTER TABLE "events" ADD COLUMN "title" varchar;
  ALTER TABLE "events" ADD COLUMN "location" varchar;
  ALTER TABLE "events" ADD COLUMN "description" jsonb;
  ALTER TABLE "events" ADD COLUMN "registration_contact_name" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_location" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_description" jsonb;
  ALTER TABLE "_events_v" ADD COLUMN "version_registration_contact_name" varchar;
  ALTER TABLE "news" ADD COLUMN "title" varchar;
  ALTER TABLE "news" ADD COLUMN "description" jsonb;
  ALTER TABLE "_news_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_news_v" ADD COLUMN "version_description" jsonb;
  ALTER TABLE "gallery_items" ADD COLUMN "video_url" varchar;
  ALTER TABLE "gallery_items" ADD COLUMN "caption" varchar;
  ALTER TABLE "_gallery_items_v" ADD COLUMN "version_video_url" varchar;
  ALTER TABLE "_gallery_items_v" ADD COLUMN "version_caption" varchar;
  ALTER TABLE "committee_members" ADD COLUMN "name" varchar;
  ALTER TABLE "committee_members" ADD COLUMN "position" varchar;
  ALTER TABLE "committee_members" ADD COLUMN "short_description" varchar;
  ALTER TABLE "_committee_members_v" ADD COLUMN "version_name" varchar;
  ALTER TABLE "_committee_members_v" ADD COLUMN "version_position" varchar;
  ALTER TABLE "_committee_members_v" ADD COLUMN "version_short_description" varchar;
  ALTER TABLE "documents" ADD COLUMN "title" varchar;
  ALTER TABLE "documents" ADD COLUMN "description" varchar;
  ALTER TABLE "_documents_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_documents_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "site_settings_social" ADD COLUMN "platform" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "site_name" varchar DEFAULT 'Rana Community Hub' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "tagline" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "home_hero_heading" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "home_hero_subheading" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "home_intro_text" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "home_history_heading" varchar DEFAULT 'Our History';
  ALTER TABLE "site_settings" ADD COLUMN "home_history_content" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "about_introduction" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "about_history_and_background" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "about_vision_and_mission" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "about_objectives" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "about_heritage_and_culture" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "about_achievements" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "contact_address" varchar;
  CREATE UNIQUE INDEX "villages_name_idx" ON "villages" USING btree ("name");
  CREATE INDEX "_villages_v_version_version_name_idx" ON "_villages_v" USING btree ("version_name");
  ALTER TABLE "_villages_v" DROP COLUMN "snapshot";
  ALTER TABLE "_villages_v" DROP COLUMN "published_locale";
  ALTER TABLE "_family_members_v" DROP COLUMN "snapshot";
  ALTER TABLE "_family_members_v" DROP COLUMN "published_locale";
  ALTER TABLE "_family_relationships_v" DROP COLUMN "snapshot";
  ALTER TABLE "_family_relationships_v" DROP COLUMN "published_locale";
  ALTER TABLE "_events_v" DROP COLUMN "snapshot";
  ALTER TABLE "_events_v" DROP COLUMN "published_locale";
  ALTER TABLE "_news_v" DROP COLUMN "snapshot";
  ALTER TABLE "_news_v" DROP COLUMN "published_locale";
  ALTER TABLE "_gallery_items_v" DROP COLUMN "snapshot";
  ALTER TABLE "_gallery_items_v" DROP COLUMN "published_locale";
  ALTER TABLE "_committee_members_v" DROP COLUMN "snapshot";
  ALTER TABLE "_committee_members_v" DROP COLUMN "published_locale";
  ALTER TABLE "_documents_v" DROP COLUMN "snapshot";
  ALTER TABLE "_documents_v" DROP COLUMN "published_locale";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__villages_v_published_locale";
  DROP TYPE "public"."enum__family_members_v_published_locale";
  DROP TYPE "public"."enum__family_relationships_v_published_locale";
  DROP TYPE "public"."enum__events_v_published_locale";
  DROP TYPE "public"."enum__news_v_published_locale";
  DROP TYPE "public"."enum__gallery_items_v_published_locale";
  DROP TYPE "public"."enum__committee_members_v_published_locale";
  DROP TYPE "public"."enum__documents_v_published_locale";`)
}
