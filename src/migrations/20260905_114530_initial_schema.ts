import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_villages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__villages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_family_members_display_status" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum_family_members_gender" AS ENUM('male', 'female', 'other');
  CREATE TYPE "public"."enum_family_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__family_members_v_version_display_status" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum__family_members_v_version_gender" AS ENUM('male', 'female', 'other');
  CREATE TYPE "public"."enum__family_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_family_relationships_relationship_type" AS ENUM('parent-child', 'spouse');
  CREATE TYPE "public"."enum_family_relationships_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__family_relationships_v_version_relationship_type" AS ENUM('parent-child', 'spouse');
  CREATE TYPE "public"."enum__family_relationships_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_type" AS ENUM('community', 'village', 'notice');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_type" AS ENUM('community', 'village', 'notice');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_gallery_items_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_gallery_items_category" AS ENUM('events', 'villages', 'community', 'heritage');
  CREATE TYPE "public"."enum_gallery_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__gallery_items_v_version_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum__gallery_items_v_version_category" AS ENUM('events', 'villages', 'community', 'heritage');
  CREATE TYPE "public"."enum__gallery_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_committee_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__committee_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_documents_category" AS ENUM('forms', 'notices', 'rules', 'reports', 'other');
  CREATE TYPE "public"."enum_documents_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__documents_v_version_category" AS ENUM('forms', 'notices', 'rules', 'reports', 'other');
  CREATE TYPE "public"."enum__documents_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_submissions_status" AS ENUM('new', 'read', 'archived');
  CREATE TYPE "public"."enum_audit_log_operation" AS ENUM('create', 'update', 'delete');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "villages_important_places" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "villages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"featured" boolean DEFAULT false,
  	"cover_image_id" integer,
  	"short_description" varchar,
  	"description" jsonb,
  	"history" jsonb,
  	"location_address" varchar,
  	"location_map_embed_url" varchar,
  	"population_info" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_email" varchar,
  	"contact_info_address" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_villages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_villages_v_version_important_places" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_villages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_featured" boolean DEFAULT false,
  	"version_cover_image_id" integer,
  	"version_short_description" varchar,
  	"version_description" jsonb,
  	"version_history" jsonb,
  	"version_location_address" varchar,
  	"version_location_map_embed_url" varchar,
  	"version_population_info" varchar,
  	"version_contact_info_phone" varchar,
  	"version_contact_info_email" varchar,
  	"version_contact_info_address" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__villages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "family_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar,
  	"village_id" integer,
  	"display_status" "enum_family_members_display_status" DEFAULT 'private',
  	"generation" numeric,
  	"profile_photo_id" integer,
  	"gender" "enum_family_members_gender",
  	"birth_year" numeric,
  	"death_year" numeric,
  	"short_biography" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_family_members_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_family_members_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_full_name" varchar,
  	"version_village_id" integer,
  	"version_display_status" "enum__family_members_v_version_display_status" DEFAULT 'private',
  	"version_generation" numeric,
  	"version_profile_photo_id" integer,
  	"version_gender" "enum__family_members_v_version_gender",
  	"version_birth_year" numeric,
  	"version_death_year" numeric,
  	"version_short_biography" varchar,
  	"version_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__family_members_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "family_relationships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"relationship_type" "enum_family_relationships_relationship_type",
  	"parent_id" integer,
  	"child_id" integer,
  	"spouse_a_id" integer,
  	"spouse_b_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_family_relationships_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_family_relationships_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_relationship_type" "enum__family_relationships_v_version_relationship_type",
  	"version_parent_id" integer,
  	"version_child_id" integer,
  	"version_spouse_a_id" integer,
  	"version_spouse_b_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__family_relationships_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "events_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"village_id" integer,
  	"date" timestamp(3) with time zone,
  	"location" varchar,
  	"description" jsonb,
  	"cover_image_id" integer,
  	"registration_contact_name" varchar,
  	"registration_contact_phone" varchar,
  	"registration_contact_email" varchar,
  	"registration_registration_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_village_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_description" jsonb,
  	"version_cover_image_id" integer,
  	"version_registration_contact_name" varchar,
  	"version_registration_contact_phone" varchar,
  	"version_registration_contact_email" varchar,
  	"version_registration_registration_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"type" "enum_news_type" DEFAULT 'community',
  	"village_id" integer,
  	"date" timestamp(3) with time zone,
  	"description" jsonb,
  	"image_id" integer,
  	"attachment_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_type" "enum__news_v_version_type" DEFAULT 'community',
  	"version_village_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_description" jsonb,
  	"version_image_id" integer,
  	"version_attachment_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "gallery_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_gallery_items_type" DEFAULT 'image',
  	"image_id" integer,
  	"video_url" varchar,
  	"caption" varchar,
  	"category" "enum_gallery_items_category",
  	"village_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_gallery_items_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_gallery_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_type" "enum__gallery_items_v_version_type" DEFAULT 'image',
  	"version_image_id" integer,
  	"version_video_url" varchar,
  	"version_caption" varchar,
  	"version_category" "enum__gallery_items_v_version_category",
  	"version_village_id" integer,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__gallery_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "committee_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"position" varchar,
  	"photo_id" integer,
  	"short_description" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_email" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_committee_members_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_committee_members_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_position" varchar,
  	"version_photo_id" integer,
  	"version_short_description" varchar,
  	"version_contact_info_phone" varchar,
  	"version_contact_info_email" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__committee_members_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"category" "enum_documents_category",
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_documents_status" DEFAULT 'draft',
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "_documents_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_category" "enum__documents_v_version_category",
  	"version_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__documents_v_version_status" DEFAULT 'draft',
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_contact_submissions_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_slug" varchar NOT NULL,
  	"document_id" varchar NOT NULL,
  	"operation" "enum_audit_log_operation" NOT NULL,
  	"performed_by_email" varchar,
  	"summary" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"villages_id" integer,
  	"family_members_id" integer,
  	"family_relationships_id" integer,
  	"events_id" integer,
  	"news_id" integer,
  	"gallery_items_id" integer,
  	"committee_members_id" integer,
  	"documents_id" integer,
  	"contact_submissions_id" integer,
  	"audit_log_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_home_hero_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Rana Community Hub' NOT NULL,
  	"tagline" varchar,
  	"logo_id" integer,
  	"home_hero_heading" varchar,
  	"home_hero_subheading" varchar,
  	"home_hero_video_id" integer,
  	"home_intro_text" jsonb,
  	"home_history_heading" varchar DEFAULT 'Our History',
  	"home_history_content" jsonb,
  	"home_history_image_id" integer,
  	"about_introduction" jsonb,
  	"about_history_and_background" jsonb,
  	"about_vision_and_mission" jsonb,
  	"about_objectives" jsonb,
  	"about_heritage_and_culture" jsonb,
  	"about_achievements" jsonb,
  	"contact_address" varchar,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"contact_map_embed_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "villages_important_places" ADD CONSTRAINT "villages_important_places_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."villages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "villages" ADD CONSTRAINT "villages_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_villages_v_version_important_places" ADD CONSTRAINT "_villages_v_version_important_places_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_villages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_villages_v" ADD CONSTRAINT "_villages_v_parent_id_villages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."villages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_villages_v" ADD CONSTRAINT "_villages_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "family_members" ADD CONSTRAINT "family_members_village_id_villages_id_fk" FOREIGN KEY ("village_id") REFERENCES "public"."villages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "family_members" ADD CONSTRAINT "family_members_profile_photo_id_media_id_fk" FOREIGN KEY ("profile_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_family_members_v" ADD CONSTRAINT "_family_members_v_parent_id_family_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."family_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_family_members_v" ADD CONSTRAINT "_family_members_v_version_village_id_villages_id_fk" FOREIGN KEY ("version_village_id") REFERENCES "public"."villages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_family_members_v" ADD CONSTRAINT "_family_members_v_version_profile_photo_id_media_id_fk" FOREIGN KEY ("version_profile_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "family_relationships" ADD CONSTRAINT "family_relationships_parent_id_family_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."family_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "family_relationships" ADD CONSTRAINT "family_relationships_child_id_family_members_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."family_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "family_relationships" ADD CONSTRAINT "family_relationships_spouse_a_id_family_members_id_fk" FOREIGN KEY ("spouse_a_id") REFERENCES "public"."family_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "family_relationships" ADD CONSTRAINT "family_relationships_spouse_b_id_family_members_id_fk" FOREIGN KEY ("spouse_b_id") REFERENCES "public"."family_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_family_relationships_v" ADD CONSTRAINT "_family_relationships_v_parent_id_family_relationships_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."family_relationships"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_family_relationships_v" ADD CONSTRAINT "_family_relationships_v_version_parent_id_family_members_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."family_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_family_relationships_v" ADD CONSTRAINT "_family_relationships_v_version_child_id_family_members_id_fk" FOREIGN KEY ("version_child_id") REFERENCES "public"."family_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_family_relationships_v" ADD CONSTRAINT "_family_relationships_v_version_spouse_a_id_family_members_id_fk" FOREIGN KEY ("version_spouse_a_id") REFERENCES "public"."family_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_family_relationships_v" ADD CONSTRAINT "_family_relationships_v_version_spouse_b_id_family_members_id_fk" FOREIGN KEY ("version_spouse_b_id") REFERENCES "public"."family_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_village_id_villages_id_fk" FOREIGN KEY ("village_id") REFERENCES "public"."villages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_gallery" ADD CONSTRAINT "_events_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_gallery" ADD CONSTRAINT "_events_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_village_id_villages_id_fk" FOREIGN KEY ("version_village_id") REFERENCES "public"."villages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_village_id_villages_id_fk" FOREIGN KEY ("village_id") REFERENCES "public"."villages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_attachment_id_media_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_village_id_villages_id_fk" FOREIGN KEY ("version_village_id") REFERENCES "public"."villages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_attachment_id_media_id_fk" FOREIGN KEY ("version_attachment_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_village_id_villages_id_fk" FOREIGN KEY ("village_id") REFERENCES "public"."villages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_items_v" ADD CONSTRAINT "_gallery_items_v_parent_id_gallery_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gallery_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_items_v" ADD CONSTRAINT "_gallery_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_items_v" ADD CONSTRAINT "_gallery_items_v_version_village_id_villages_id_fk" FOREIGN KEY ("version_village_id") REFERENCES "public"."villages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committee_members" ADD CONSTRAINT "committee_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_committee_members_v" ADD CONSTRAINT "_committee_members_v_parent_id_committee_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."committee_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_committee_members_v" ADD CONSTRAINT "_committee_members_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_documents_v" ADD CONSTRAINT "_documents_v_parent_id_documents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_villages_fk" FOREIGN KEY ("villages_id") REFERENCES "public"."villages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_family_members_fk" FOREIGN KEY ("family_members_id") REFERENCES "public"."family_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_family_relationships_fk" FOREIGN KEY ("family_relationships_id") REFERENCES "public"."family_relationships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_items_fk" FOREIGN KEY ("gallery_items_id") REFERENCES "public"."gallery_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_committee_members_fk" FOREIGN KEY ("committee_members_id") REFERENCES "public"."committee_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_home_hero_images" ADD CONSTRAINT "site_settings_home_hero_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_home_hero_images" ADD CONSTRAINT "site_settings_home_hero_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_home_hero_video_id_media_id_fk" FOREIGN KEY ("home_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_home_history_image_id_media_id_fk" FOREIGN KEY ("home_history_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "villages_important_places_order_idx" ON "villages_important_places" USING btree ("_order");
  CREATE INDEX "villages_important_places_parent_id_idx" ON "villages_important_places" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "villages_name_idx" ON "villages" USING btree ("name");
  CREATE UNIQUE INDEX "villages_slug_idx" ON "villages" USING btree ("slug");
  CREATE INDEX "villages_cover_image_idx" ON "villages" USING btree ("cover_image_id");
  CREATE INDEX "villages_updated_at_idx" ON "villages" USING btree ("updated_at");
  CREATE INDEX "villages_created_at_idx" ON "villages" USING btree ("created_at");
  CREATE INDEX "villages__status_idx" ON "villages" USING btree ("_status");
  CREATE INDEX "_villages_v_version_important_places_order_idx" ON "_villages_v_version_important_places" USING btree ("_order");
  CREATE INDEX "_villages_v_version_important_places_parent_id_idx" ON "_villages_v_version_important_places" USING btree ("_parent_id");
  CREATE INDEX "_villages_v_parent_idx" ON "_villages_v" USING btree ("parent_id");
  CREATE INDEX "_villages_v_version_version_name_idx" ON "_villages_v" USING btree ("version_name");
  CREATE INDEX "_villages_v_version_version_slug_idx" ON "_villages_v" USING btree ("version_slug");
  CREATE INDEX "_villages_v_version_version_cover_image_idx" ON "_villages_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_villages_v_version_version_updated_at_idx" ON "_villages_v" USING btree ("version_updated_at");
  CREATE INDEX "_villages_v_version_version_created_at_idx" ON "_villages_v" USING btree ("version_created_at");
  CREATE INDEX "_villages_v_version_version__status_idx" ON "_villages_v" USING btree ("version__status");
  CREATE INDEX "_villages_v_created_at_idx" ON "_villages_v" USING btree ("created_at");
  CREATE INDEX "_villages_v_updated_at_idx" ON "_villages_v" USING btree ("updated_at");
  CREATE INDEX "_villages_v_latest_idx" ON "_villages_v" USING btree ("latest");
  CREATE INDEX "family_members_village_idx" ON "family_members" USING btree ("village_id");
  CREATE INDEX "family_members_profile_photo_idx" ON "family_members" USING btree ("profile_photo_id");
  CREATE INDEX "family_members_updated_at_idx" ON "family_members" USING btree ("updated_at");
  CREATE INDEX "family_members_created_at_idx" ON "family_members" USING btree ("created_at");
  CREATE INDEX "family_members__status_idx" ON "family_members" USING btree ("_status");
  CREATE INDEX "_family_members_v_parent_idx" ON "_family_members_v" USING btree ("parent_id");
  CREATE INDEX "_family_members_v_version_version_village_idx" ON "_family_members_v" USING btree ("version_village_id");
  CREATE INDEX "_family_members_v_version_version_profile_photo_idx" ON "_family_members_v" USING btree ("version_profile_photo_id");
  CREATE INDEX "_family_members_v_version_version_updated_at_idx" ON "_family_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_family_members_v_version_version_created_at_idx" ON "_family_members_v" USING btree ("version_created_at");
  CREATE INDEX "_family_members_v_version_version__status_idx" ON "_family_members_v" USING btree ("version__status");
  CREATE INDEX "_family_members_v_created_at_idx" ON "_family_members_v" USING btree ("created_at");
  CREATE INDEX "_family_members_v_updated_at_idx" ON "_family_members_v" USING btree ("updated_at");
  CREATE INDEX "_family_members_v_latest_idx" ON "_family_members_v" USING btree ("latest");
  CREATE INDEX "family_relationships_parent_idx" ON "family_relationships" USING btree ("parent_id");
  CREATE INDEX "family_relationships_child_idx" ON "family_relationships" USING btree ("child_id");
  CREATE INDEX "family_relationships_spouse_a_idx" ON "family_relationships" USING btree ("spouse_a_id");
  CREATE INDEX "family_relationships_spouse_b_idx" ON "family_relationships" USING btree ("spouse_b_id");
  CREATE INDEX "family_relationships_updated_at_idx" ON "family_relationships" USING btree ("updated_at");
  CREATE INDEX "family_relationships_created_at_idx" ON "family_relationships" USING btree ("created_at");
  CREATE INDEX "family_relationships__status_idx" ON "family_relationships" USING btree ("_status");
  CREATE INDEX "_family_relationships_v_parent_idx" ON "_family_relationships_v" USING btree ("parent_id");
  CREATE INDEX "_family_relationships_v_version_version_parent_idx" ON "_family_relationships_v" USING btree ("version_parent_id");
  CREATE INDEX "_family_relationships_v_version_version_child_idx" ON "_family_relationships_v" USING btree ("version_child_id");
  CREATE INDEX "_family_relationships_v_version_version_spouse_a_idx" ON "_family_relationships_v" USING btree ("version_spouse_a_id");
  CREATE INDEX "_family_relationships_v_version_version_spouse_b_idx" ON "_family_relationships_v" USING btree ("version_spouse_b_id");
  CREATE INDEX "_family_relationships_v_version_version_updated_at_idx" ON "_family_relationships_v" USING btree ("version_updated_at");
  CREATE INDEX "_family_relationships_v_version_version_created_at_idx" ON "_family_relationships_v" USING btree ("version_created_at");
  CREATE INDEX "_family_relationships_v_version_version__status_idx" ON "_family_relationships_v" USING btree ("version__status");
  CREATE INDEX "_family_relationships_v_created_at_idx" ON "_family_relationships_v" USING btree ("created_at");
  CREATE INDEX "_family_relationships_v_updated_at_idx" ON "_family_relationships_v" USING btree ("updated_at");
  CREATE INDEX "_family_relationships_v_latest_idx" ON "_family_relationships_v" USING btree ("latest");
  CREATE INDEX "events_gallery_order_idx" ON "events_gallery" USING btree ("_order");
  CREATE INDEX "events_gallery_parent_id_idx" ON "events_gallery" USING btree ("_parent_id");
  CREATE INDEX "events_gallery_image_idx" ON "events_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_village_idx" ON "events" USING btree ("village_id");
  CREATE INDEX "events_cover_image_idx" ON "events" USING btree ("cover_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_version_gallery_order_idx" ON "_events_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_events_v_version_gallery_parent_id_idx" ON "_events_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_gallery_image_idx" ON "_events_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_village_idx" ON "_events_v" USING btree ("version_village_id");
  CREATE INDEX "_events_v_version_version_cover_image_idx" ON "_events_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_village_idx" ON "news" USING btree ("village_id");
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE INDEX "news_attachment_idx" ON "news" USING btree ("attachment_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_village_idx" ON "_news_v" USING btree ("version_village_id");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_version_attachment_idx" ON "_news_v" USING btree ("version_attachment_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "gallery_items_image_idx" ON "gallery_items" USING btree ("image_id");
  CREATE INDEX "gallery_items_village_idx" ON "gallery_items" USING btree ("village_id");
  CREATE INDEX "gallery_items_updated_at_idx" ON "gallery_items" USING btree ("updated_at");
  CREATE INDEX "gallery_items_created_at_idx" ON "gallery_items" USING btree ("created_at");
  CREATE INDEX "gallery_items__status_idx" ON "gallery_items" USING btree ("_status");
  CREATE INDEX "_gallery_items_v_parent_idx" ON "_gallery_items_v" USING btree ("parent_id");
  CREATE INDEX "_gallery_items_v_version_version_image_idx" ON "_gallery_items_v" USING btree ("version_image_id");
  CREATE INDEX "_gallery_items_v_version_version_village_idx" ON "_gallery_items_v" USING btree ("version_village_id");
  CREATE INDEX "_gallery_items_v_version_version_updated_at_idx" ON "_gallery_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_gallery_items_v_version_version_created_at_idx" ON "_gallery_items_v" USING btree ("version_created_at");
  CREATE INDEX "_gallery_items_v_version_version__status_idx" ON "_gallery_items_v" USING btree ("version__status");
  CREATE INDEX "_gallery_items_v_created_at_idx" ON "_gallery_items_v" USING btree ("created_at");
  CREATE INDEX "_gallery_items_v_updated_at_idx" ON "_gallery_items_v" USING btree ("updated_at");
  CREATE INDEX "_gallery_items_v_latest_idx" ON "_gallery_items_v" USING btree ("latest");
  CREATE INDEX "committee_members_photo_idx" ON "committee_members" USING btree ("photo_id");
  CREATE INDEX "committee_members_updated_at_idx" ON "committee_members" USING btree ("updated_at");
  CREATE INDEX "committee_members_created_at_idx" ON "committee_members" USING btree ("created_at");
  CREATE INDEX "committee_members__status_idx" ON "committee_members" USING btree ("_status");
  CREATE INDEX "_committee_members_v_parent_idx" ON "_committee_members_v" USING btree ("parent_id");
  CREATE INDEX "_committee_members_v_version_version_photo_idx" ON "_committee_members_v" USING btree ("version_photo_id");
  CREATE INDEX "_committee_members_v_version_version_updated_at_idx" ON "_committee_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_committee_members_v_version_version_created_at_idx" ON "_committee_members_v" USING btree ("version_created_at");
  CREATE INDEX "_committee_members_v_version_version__status_idx" ON "_committee_members_v" USING btree ("version__status");
  CREATE INDEX "_committee_members_v_created_at_idx" ON "_committee_members_v" USING btree ("created_at");
  CREATE INDEX "_committee_members_v_updated_at_idx" ON "_committee_members_v" USING btree ("updated_at");
  CREATE INDEX "_committee_members_v_latest_idx" ON "_committee_members_v" USING btree ("latest");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE INDEX "documents__status_idx" ON "documents" USING btree ("_status");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "_documents_v_parent_idx" ON "_documents_v" USING btree ("parent_id");
  CREATE INDEX "_documents_v_version_version_updated_at_idx" ON "_documents_v" USING btree ("version_updated_at");
  CREATE INDEX "_documents_v_version_version_created_at_idx" ON "_documents_v" USING btree ("version_created_at");
  CREATE INDEX "_documents_v_version_version__status_idx" ON "_documents_v" USING btree ("version__status");
  CREATE INDEX "_documents_v_version_version_filename_idx" ON "_documents_v" USING btree ("version_filename");
  CREATE INDEX "_documents_v_created_at_idx" ON "_documents_v" USING btree ("created_at");
  CREATE INDEX "_documents_v_updated_at_idx" ON "_documents_v" USING btree ("updated_at");
  CREATE INDEX "_documents_v_latest_idx" ON "_documents_v" USING btree ("latest");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE INDEX "audit_log_updated_at_idx" ON "audit_log" USING btree ("updated_at");
  CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_villages_id_idx" ON "payload_locked_documents_rels" USING btree ("villages_id");
  CREATE INDEX "payload_locked_documents_rels_family_members_id_idx" ON "payload_locked_documents_rels" USING btree ("family_members_id");
  CREATE INDEX "payload_locked_documents_rels_family_relationships_id_idx" ON "payload_locked_documents_rels" USING btree ("family_relationships_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_items_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_items_id");
  CREATE INDEX "payload_locked_documents_rels_committee_members_id_idx" ON "payload_locked_documents_rels" USING btree ("committee_members_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_home_hero_images_order_idx" ON "site_settings_home_hero_images" USING btree ("_order");
  CREATE INDEX "site_settings_home_hero_images_parent_id_idx" ON "site_settings_home_hero_images" USING btree ("_parent_id");
  CREATE INDEX "site_settings_home_hero_images_image_idx" ON "site_settings_home_hero_images" USING btree ("image_id");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_home_home_hero_video_idx" ON "site_settings" USING btree ("home_hero_video_id");
  CREATE INDEX "site_settings_home_history_home_history_image_idx" ON "site_settings" USING btree ("home_history_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "villages_important_places" CASCADE;
  DROP TABLE "villages" CASCADE;
  DROP TABLE "_villages_v_version_important_places" CASCADE;
  DROP TABLE "_villages_v" CASCADE;
  DROP TABLE "family_members" CASCADE;
  DROP TABLE "_family_members_v" CASCADE;
  DROP TABLE "family_relationships" CASCADE;
  DROP TABLE "_family_relationships_v" CASCADE;
  DROP TABLE "events_gallery" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v_version_gallery" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "gallery_items" CASCADE;
  DROP TABLE "_gallery_items_v" CASCADE;
  DROP TABLE "committee_members" CASCADE;
  DROP TABLE "_committee_members_v" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "_documents_v" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "audit_log" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_home_hero_images" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_villages_status";
  DROP TYPE "public"."enum__villages_v_version_status";
  DROP TYPE "public"."enum_family_members_display_status";
  DROP TYPE "public"."enum_family_members_gender";
  DROP TYPE "public"."enum_family_members_status";
  DROP TYPE "public"."enum__family_members_v_version_display_status";
  DROP TYPE "public"."enum__family_members_v_version_gender";
  DROP TYPE "public"."enum__family_members_v_version_status";
  DROP TYPE "public"."enum_family_relationships_relationship_type";
  DROP TYPE "public"."enum_family_relationships_status";
  DROP TYPE "public"."enum__family_relationships_v_version_relationship_type";
  DROP TYPE "public"."enum__family_relationships_v_version_status";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_news_type";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_type";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_gallery_items_type";
  DROP TYPE "public"."enum_gallery_items_category";
  DROP TYPE "public"."enum_gallery_items_status";
  DROP TYPE "public"."enum__gallery_items_v_version_type";
  DROP TYPE "public"."enum__gallery_items_v_version_category";
  DROP TYPE "public"."enum__gallery_items_v_version_status";
  DROP TYPE "public"."enum_committee_members_status";
  DROP TYPE "public"."enum__committee_members_v_version_status";
  DROP TYPE "public"."enum_documents_category";
  DROP TYPE "public"."enum_documents_status";
  DROP TYPE "public"."enum__documents_v_version_category";
  DROP TYPE "public"."enum__documents_v_version_status";
  DROP TYPE "public"."enum_contact_submissions_status";
  DROP TYPE "public"."enum_audit_log_operation";`)
}
