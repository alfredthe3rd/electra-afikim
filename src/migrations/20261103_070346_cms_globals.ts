import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { seedContent } from './seed'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_header_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"icon_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_legal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_site_name" varchar NOT NULL,
  	"brand_logo_id" integer NOT NULL,
  	"brand_site_url" varchar NOT NULL,
  	"contact_details_phone_label" varchar NOT NULL,
  	"contact_details_address" varchar NOT NULL,
  	"contact_details_dial_cta_label" varchar NOT NULL,
  	"contact_details_dial_href" varchar NOT NULL,
  	"header_mobile_cta_label" varchar NOT NULL,
  	"header_mobile_cta_href" varchar NOT NULL,
  	"footer_graphic_id" integer NOT NULL,
  	"footer_nav_heading" varchar NOT NULL,
  	"footer_divisions_heading" varchar NOT NULL,
  	"footer_contact_heading" varchar NOT NULL,
  	"footer_credit_text" varchar,
  	"footer_credit_url" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_site_settings_v_version_header_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_footer_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_footer_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"icon_id" integer NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_footer_legal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_brand_site_name" varchar NOT NULL,
  	"version_brand_logo_id" integer NOT NULL,
  	"version_brand_site_url" varchar NOT NULL,
  	"version_contact_details_phone_label" varchar NOT NULL,
  	"version_contact_details_address" varchar NOT NULL,
  	"version_contact_details_dial_cta_label" varchar NOT NULL,
  	"version_contact_details_dial_href" varchar NOT NULL,
  	"version_header_mobile_cta_label" varchar NOT NULL,
  	"version_header_mobile_cta_href" varchar NOT NULL,
  	"version_footer_graphic_id" integer NOT NULL,
  	"version_footer_nav_heading" varchar NOT NULL,
  	"version_footer_divisions_heading" varchar NOT NULL,
  	"version_footer_contact_heading" varchar NOT NULL,
  	"version_footer_credit_text" varchar,
  	"version_footer_credit_url" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_divisions_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"text" varchar NOT NULL,
  	"video_id" integer,
  	"default_video" varchar
  );
  
  CREATE TABLE "home_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" numeric NOT NULL,
  	"suffix" varchar,
  	"overlay_text" varchar NOT NULL,
  	"legend_text" varchar NOT NULL
  );
  
  CREATE TABLE "home_partners_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title_line1" varchar NOT NULL,
  	"hero_title_line2" varchar NOT NULL,
  	"hero_subtitle" varchar NOT NULL,
  	"hero_scroll_cue_label" varchar NOT NULL,
  	"about_title" varchar NOT NULL,
  	"about_text" varchar NOT NULL,
  	"about_cta_label" varchar NOT NULL,
  	"about_cta_href" varchar NOT NULL,
  	"divisions_title" varchar NOT NULL,
  	"divisions_subtitle" varchar NOT NULL,
  	"stats_title" varchar NOT NULL,
  	"stats_subtitle" varchar NOT NULL,
  	"partners_title_line1" varchar NOT NULL,
  	"partners_title_line2" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_home_v_version_divisions_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"text" varchar NOT NULL,
  	"video_id" integer,
  	"default_video" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric NOT NULL,
  	"suffix" varchar,
  	"overlay_text" varchar NOT NULL,
  	"legend_text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_partners_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_title_line1" varchar NOT NULL,
  	"version_hero_title_line2" varchar NOT NULL,
  	"version_hero_subtitle" varchar NOT NULL,
  	"version_hero_scroll_cue_label" varchar NOT NULL,
  	"version_about_title" varchar NOT NULL,
  	"version_about_text" varchar NOT NULL,
  	"version_about_cta_label" varchar NOT NULL,
  	"version_about_cta_href" varchar NOT NULL,
  	"version_divisions_title" varchar NOT NULL,
  	"version_divisions_subtitle" varchar NOT NULL,
  	"version_stats_title" varchar NOT NULL,
  	"version_stats_subtitle" varchar NOT NULL,
  	"version_partners_title_line1" varchar NOT NULL,
  	"version_partners_title_line2" varchar NOT NULL,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about_hero_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_icons_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "about_vision_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_values_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "about_team_top_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer NOT NULL
  );
  
  CREATE TABLE "about_team_bottom_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer NOT NULL
  );
  
  CREATE TABLE "about_story_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"lines" varchar NOT NULL,
  	"bullets" boolean
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar NOT NULL,
  	"hero_video_id" integer,
  	"icons_title" varchar NOT NULL,
  	"vision_title" varchar NOT NULL,
  	"vision_subtitle" varchar NOT NULL,
  	"vision_video_id" integer,
  	"values_title" varchar NOT NULL,
  	"team_title" varchar NOT NULL,
  	"story_title" varchar NOT NULL,
  	"story_subtitle" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_about_v_version_hero_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v_version_icons_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v_version_vision_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v_version_values_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v_version_team_top_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v_version_team_bottom_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v_version_story_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"lines" varchar NOT NULL,
  	"bullets" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_title" varchar NOT NULL,
  	"version_hero_subtitle" varchar NOT NULL,
  	"version_hero_video_id" integer,
  	"version_icons_title" varchar NOT NULL,
  	"version_vision_title" varchar NOT NULL,
  	"version_vision_subtitle" varchar NOT NULL,
  	"version_vision_video_id" integer,
  	"version_values_title" varchar NOT NULL,
  	"version_team_title" varchar NOT NULL,
  	"version_story_title" varchar NOT NULL,
  	"version_story_subtitle" varchar NOT NULL,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lobby" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_video_id" integer,
  	"page_title" varchar NOT NULL,
  	"page_subtitle" varchar NOT NULL,
  	"page_cta_label" varchar NOT NULL,
  	"page_ticker_highlight" varchar NOT NULL,
  	"page_ticker_muted" varchar NOT NULL,
  	"division_visit_site_label" varchar NOT NULL,
  	"division_stats_heading" varchar NOT NULL,
  	"division_good_to_know_heading" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_lobby_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_page_video_id" integer,
  	"version_page_title" varchar NOT NULL,
  	"version_page_subtitle" varchar NOT NULL,
  	"version_page_cta_label" varchar NOT NULL,
  	"version_page_ticker_highlight" varchar NOT NULL,
  	"version_page_ticker_muted" varchar NOT NULL,
  	"version_division_visit_site_label" varchar NOT NULL,
  	"version_division_stats_heading" varchar NOT NULL,
  	"version_division_good_to_know_heading" varchar NOT NULL,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "social_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"list" varchar NOT NULL
  );
  
  CREATE TABLE "social_carousel_row1" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "social_carousel_row2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "social" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_video_id" integer,
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar NOT NULL,
  	"cta_title" varchar NOT NULL,
  	"cta_subtitle" varchar NOT NULL,
  	"cta_label" varchar NOT NULL,
  	"cta_href" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_social_v_version_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"list" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_social_v_version_carousel_row1" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_social_v_version_carousel_row2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_social_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_video_id" integer,
  	"version_hero_title" varchar NOT NULL,
  	"version_hero_subtitle" varchar NOT NULL,
  	"version_cta_title" varchar NOT NULL,
  	"version_cta_subtitle" varchar NOT NULL,
  	"version_cta_label" varchar NOT NULL,
  	"version_cta_href" varchar NOT NULL,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_video_id" integer,
  	"page_title" varchar NOT NULL,
  	"page_subtitle" varchar NOT NULL,
  	"form_name_placeholder" varchar NOT NULL,
  	"form_phone_placeholder" varchar NOT NULL,
  	"form_email_placeholder" varchar NOT NULL,
  	"form_message_placeholder" varchar NOT NULL,
  	"form_submit_label" varchar NOT NULL,
  	"form_sending_label" varchar NOT NULL,
  	"form_sent_label" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contact_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_page_video_id" integer,
  	"version_page_title" varchar NOT NULL,
  	"version_page_subtitle" varchar NOT NULL,
  	"version_form_name_placeholder" varchar NOT NULL,
  	"version_form_phone_placeholder" varchar NOT NULL,
  	"version_form_email_placeholder" varchar NOT NULL,
  	"version_form_message_placeholder" varchar NOT NULL,
  	"version_form_submit_label" varchar NOT NULL,
  	"version_form_sending_label" varchar NOT NULL,
  	"version_form_sent_label" varchar NOT NULL,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "accessibility_page_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"address" varchar NOT NULL
  );
  
  CREATE TABLE "accessibility" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_title" varchar NOT NULL,
  	"page_body_top" jsonb NOT NULL,
  	"page_phone_label" varchar NOT NULL,
  	"page_email_label" varchar NOT NULL,
  	"page_address_label" varchar NOT NULL,
  	"page_body_bottom" jsonb NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_accessibility_v_version_page_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_accessibility_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_page_title" varchar NOT NULL,
  	"version_page_body_top" jsonb NOT NULL,
  	"version_page_phone_label" varchar NOT NULL,
  	"version_page_email_label" varchar NOT NULL,
  	"version_page_address_label" varchar NOT NULL,
  	"version_page_body_bottom" jsonb NOT NULL,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "privacy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_title" varchar NOT NULL,
  	"page_body" jsonb NOT NULL,
  	"page_updated_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_privacy_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_page_title" varchar NOT NULL,
  	"version_page_body" jsonb NOT NULL,
  	"version_page_updated_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "divisions" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "divisions" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "divisions" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "divisions" ADD COLUMN "meta_noindex" boolean;
  ALTER TABLE "site_settings_header_nav" ADD CONSTRAINT "site_settings_header_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_nav" ADD CONSTRAINT "site_settings_footer_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_social" ADD CONSTRAINT "site_settings_footer_social_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_footer_social" ADD CONSTRAINT "site_settings_footer_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_legal" ADD CONSTRAINT "site_settings_footer_legal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_brand_logo_id_media_id_fk" FOREIGN KEY ("brand_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_footer_graphic_id_media_id_fk" FOREIGN KEY ("footer_graphic_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_header_nav" ADD CONSTRAINT "_site_settings_v_version_header_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_footer_nav" ADD CONSTRAINT "_site_settings_v_version_footer_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_footer_social" ADD CONSTRAINT "_site_settings_v_version_footer_social_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_footer_social" ADD CONSTRAINT "_site_settings_v_version_footer_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_footer_legal" ADD CONSTRAINT "_site_settings_v_version_footer_legal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_brand_logo_id_media_id_fk" FOREIGN KEY ("version_brand_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_footer_graphic_id_media_id_fk" FOREIGN KEY ("version_footer_graphic_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_divisions_slides" ADD CONSTRAINT "home_divisions_slides_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_divisions_slides" ADD CONSTRAINT "home_divisions_slides_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_divisions_slides" ADD CONSTRAINT "home_divisions_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_stats_items" ADD CONSTRAINT "home_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_partners_logos" ADD CONSTRAINT "home_partners_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_partners_logos" ADD CONSTRAINT "home_partners_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_version_divisions_slides" ADD CONSTRAINT "_home_v_version_divisions_slides_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_version_divisions_slides" ADD CONSTRAINT "_home_v_version_divisions_slides_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_version_divisions_slides" ADD CONSTRAINT "_home_v_version_divisions_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_stats_items" ADD CONSTRAINT "_home_v_version_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_partners_logos" ADD CONSTRAINT "_home_v_version_partners_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_version_partners_logos" ADD CONSTRAINT "_home_v_version_partners_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_hero_steps" ADD CONSTRAINT "about_hero_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_icons_items" ADD CONSTRAINT "about_icons_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_icons_items" ADD CONSTRAINT "about_icons_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_vision_cards" ADD CONSTRAINT "about_vision_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_values_items" ADD CONSTRAINT "about_values_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_team_top_row" ADD CONSTRAINT "about_team_top_row_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_team_top_row" ADD CONSTRAINT "about_team_top_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_team_bottom_row" ADD CONSTRAINT "about_team_bottom_row_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_team_bottom_row" ADD CONSTRAINT "about_team_bottom_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_story_milestones" ADD CONSTRAINT "about_story_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_vision_video_id_media_id_fk" FOREIGN KEY ("vision_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_v_version_hero_steps" ADD CONSTRAINT "_about_v_version_hero_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_icons_items" ADD CONSTRAINT "_about_v_version_icons_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_v_version_icons_items" ADD CONSTRAINT "_about_v_version_icons_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_vision_cards" ADD CONSTRAINT "_about_v_version_vision_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_values_items" ADD CONSTRAINT "_about_v_version_values_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_team_top_row" ADD CONSTRAINT "_about_v_version_team_top_row_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_v_version_team_top_row" ADD CONSTRAINT "_about_v_version_team_top_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_team_bottom_row" ADD CONSTRAINT "_about_v_version_team_bottom_row_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_v_version_team_bottom_row" ADD CONSTRAINT "_about_v_version_team_bottom_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_story_milestones" ADD CONSTRAINT "_about_v_version_story_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v" ADD CONSTRAINT "_about_v_version_hero_video_id_media_id_fk" FOREIGN KEY ("version_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_v" ADD CONSTRAINT "_about_v_version_vision_video_id_media_id_fk" FOREIGN KEY ("version_vision_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_v" ADD CONSTRAINT "_about_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lobby" ADD CONSTRAINT "lobby_page_video_id_media_id_fk" FOREIGN KEY ("page_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lobby" ADD CONSTRAINT "lobby_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lobby_v" ADD CONSTRAINT "_lobby_v_version_page_video_id_media_id_fk" FOREIGN KEY ("version_page_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lobby_v" ADD CONSTRAINT "_lobby_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_cards_items" ADD CONSTRAINT "social_cards_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_cards_items" ADD CONSTRAINT "social_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_carousel_row1" ADD CONSTRAINT "social_carousel_row1_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_carousel_row1" ADD CONSTRAINT "social_carousel_row1_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_carousel_row2" ADD CONSTRAINT "social_carousel_row2_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_carousel_row2" ADD CONSTRAINT "social_carousel_row2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social" ADD CONSTRAINT "social_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social" ADD CONSTRAINT "social_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_v_version_cards_items" ADD CONSTRAINT "_social_v_version_cards_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_v_version_cards_items" ADD CONSTRAINT "_social_v_version_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_social_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_social_v_version_carousel_row1" ADD CONSTRAINT "_social_v_version_carousel_row1_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_v_version_carousel_row1" ADD CONSTRAINT "_social_v_version_carousel_row1_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_social_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_social_v_version_carousel_row2" ADD CONSTRAINT "_social_v_version_carousel_row2_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_v_version_carousel_row2" ADD CONSTRAINT "_social_v_version_carousel_row2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_social_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_social_v" ADD CONSTRAINT "_social_v_version_hero_video_id_media_id_fk" FOREIGN KEY ("version_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_v" ADD CONSTRAINT "_social_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact" ADD CONSTRAINT "contact_page_video_id_media_id_fk" FOREIGN KEY ("page_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact" ADD CONSTRAINT "contact_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_v" ADD CONSTRAINT "_contact_v_version_page_video_id_media_id_fk" FOREIGN KEY ("version_page_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_v" ADD CONSTRAINT "_contact_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accessibility_page_contacts" ADD CONSTRAINT "accessibility_page_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accessibility"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accessibility" ADD CONSTRAINT "accessibility_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_accessibility_v_version_page_contacts" ADD CONSTRAINT "_accessibility_v_version_page_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accessibility_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accessibility_v" ADD CONSTRAINT "_accessibility_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "privacy" ADD CONSTRAINT "privacy_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_privacy_v" ADD CONSTRAINT "_privacy_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_header_nav_order_idx" ON "site_settings_header_nav" USING btree ("_order");
  CREATE INDEX "site_settings_header_nav_parent_id_idx" ON "site_settings_header_nav" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_nav_order_idx" ON "site_settings_footer_nav" USING btree ("_order");
  CREATE INDEX "site_settings_footer_nav_parent_id_idx" ON "site_settings_footer_nav" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_social_order_idx" ON "site_settings_footer_social" USING btree ("_order");
  CREATE INDEX "site_settings_footer_social_parent_id_idx" ON "site_settings_footer_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_social_icon_idx" ON "site_settings_footer_social" USING btree ("icon_id");
  CREATE INDEX "site_settings_footer_legal_order_idx" ON "site_settings_footer_legal" USING btree ("_order");
  CREATE INDEX "site_settings_footer_legal_parent_id_idx" ON "site_settings_footer_legal" USING btree ("_parent_id");
  CREATE INDEX "site_settings_brand_brand_logo_idx" ON "site_settings" USING btree ("brand_logo_id");
  CREATE INDEX "site_settings_footer_footer_graphic_idx" ON "site_settings" USING btree ("footer_graphic_id");
  CREATE INDEX "site_settings_meta_meta_image_idx" ON "site_settings" USING btree ("meta_image_id");
  CREATE INDEX "_site_settings_v_version_header_nav_order_idx" ON "_site_settings_v_version_header_nav" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_header_nav_parent_id_idx" ON "_site_settings_v_version_header_nav" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_footer_nav_order_idx" ON "_site_settings_v_version_footer_nav" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_footer_nav_parent_id_idx" ON "_site_settings_v_version_footer_nav" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_footer_social_order_idx" ON "_site_settings_v_version_footer_social" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_footer_social_parent_id_idx" ON "_site_settings_v_version_footer_social" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_footer_social_icon_idx" ON "_site_settings_v_version_footer_social" USING btree ("icon_id");
  CREATE INDEX "_site_settings_v_version_footer_legal_order_idx" ON "_site_settings_v_version_footer_legal" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_footer_legal_parent_id_idx" ON "_site_settings_v_version_footer_legal" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_brand_version_brand_logo_idx" ON "_site_settings_v" USING btree ("version_brand_logo_id");
  CREATE INDEX "_site_settings_v_version_footer_version_footer_graphic_idx" ON "_site_settings_v" USING btree ("version_footer_graphic_id");
  CREATE INDEX "_site_settings_v_version_meta_version_meta_image_idx" ON "_site_settings_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "home_divisions_slides_order_idx" ON "home_divisions_slides" USING btree ("_order");
  CREATE INDEX "home_divisions_slides_parent_id_idx" ON "home_divisions_slides" USING btree ("_parent_id");
  CREATE INDEX "home_divisions_slides_logo_idx" ON "home_divisions_slides" USING btree ("logo_id");
  CREATE INDEX "home_divisions_slides_video_idx" ON "home_divisions_slides" USING btree ("video_id");
  CREATE INDEX "home_stats_items_order_idx" ON "home_stats_items" USING btree ("_order");
  CREATE INDEX "home_stats_items_parent_id_idx" ON "home_stats_items" USING btree ("_parent_id");
  CREATE INDEX "home_partners_logos_order_idx" ON "home_partners_logos" USING btree ("_order");
  CREATE INDEX "home_partners_logos_parent_id_idx" ON "home_partners_logos" USING btree ("_parent_id");
  CREATE INDEX "home_partners_logos_logo_idx" ON "home_partners_logos" USING btree ("logo_id");
  CREATE INDEX "home_meta_meta_image_idx" ON "home" USING btree ("meta_image_id");
  CREATE INDEX "_home_v_version_divisions_slides_order_idx" ON "_home_v_version_divisions_slides" USING btree ("_order");
  CREATE INDEX "_home_v_version_divisions_slides_parent_id_idx" ON "_home_v_version_divisions_slides" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_divisions_slides_logo_idx" ON "_home_v_version_divisions_slides" USING btree ("logo_id");
  CREATE INDEX "_home_v_version_divisions_slides_video_idx" ON "_home_v_version_divisions_slides" USING btree ("video_id");
  CREATE INDEX "_home_v_version_stats_items_order_idx" ON "_home_v_version_stats_items" USING btree ("_order");
  CREATE INDEX "_home_v_version_stats_items_parent_id_idx" ON "_home_v_version_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_partners_logos_order_idx" ON "_home_v_version_partners_logos" USING btree ("_order");
  CREATE INDEX "_home_v_version_partners_logos_parent_id_idx" ON "_home_v_version_partners_logos" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_partners_logos_logo_idx" ON "_home_v_version_partners_logos" USING btree ("logo_id");
  CREATE INDEX "_home_v_version_meta_version_meta_image_idx" ON "_home_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_home_v_created_at_idx" ON "_home_v" USING btree ("created_at");
  CREATE INDEX "_home_v_updated_at_idx" ON "_home_v" USING btree ("updated_at");
  CREATE INDEX "about_hero_steps_order_idx" ON "about_hero_steps" USING btree ("_order");
  CREATE INDEX "about_hero_steps_parent_id_idx" ON "about_hero_steps" USING btree ("_parent_id");
  CREATE INDEX "about_icons_items_order_idx" ON "about_icons_items" USING btree ("_order");
  CREATE INDEX "about_icons_items_parent_id_idx" ON "about_icons_items" USING btree ("_parent_id");
  CREATE INDEX "about_icons_items_icon_idx" ON "about_icons_items" USING btree ("icon_id");
  CREATE INDEX "about_vision_cards_order_idx" ON "about_vision_cards" USING btree ("_order");
  CREATE INDEX "about_vision_cards_parent_id_idx" ON "about_vision_cards" USING btree ("_parent_id");
  CREATE INDEX "about_values_items_order_idx" ON "about_values_items" USING btree ("_order");
  CREATE INDEX "about_values_items_parent_id_idx" ON "about_values_items" USING btree ("_parent_id");
  CREATE INDEX "about_team_top_row_order_idx" ON "about_team_top_row" USING btree ("_order");
  CREATE INDEX "about_team_top_row_parent_id_idx" ON "about_team_top_row" USING btree ("_parent_id");
  CREATE INDEX "about_team_top_row_photo_idx" ON "about_team_top_row" USING btree ("photo_id");
  CREATE INDEX "about_team_bottom_row_order_idx" ON "about_team_bottom_row" USING btree ("_order");
  CREATE INDEX "about_team_bottom_row_parent_id_idx" ON "about_team_bottom_row" USING btree ("_parent_id");
  CREATE INDEX "about_team_bottom_row_photo_idx" ON "about_team_bottom_row" USING btree ("photo_id");
  CREATE INDEX "about_story_milestones_order_idx" ON "about_story_milestones" USING btree ("_order");
  CREATE INDEX "about_story_milestones_parent_id_idx" ON "about_story_milestones" USING btree ("_parent_id");
  CREATE INDEX "about_hero_hero_video_idx" ON "about" USING btree ("hero_video_id");
  CREATE INDEX "about_vision_vision_video_idx" ON "about" USING btree ("vision_video_id");
  CREATE INDEX "about_meta_meta_image_idx" ON "about" USING btree ("meta_image_id");
  CREATE INDEX "_about_v_version_hero_steps_order_idx" ON "_about_v_version_hero_steps" USING btree ("_order");
  CREATE INDEX "_about_v_version_hero_steps_parent_id_idx" ON "_about_v_version_hero_steps" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_icons_items_order_idx" ON "_about_v_version_icons_items" USING btree ("_order");
  CREATE INDEX "_about_v_version_icons_items_parent_id_idx" ON "_about_v_version_icons_items" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_icons_items_icon_idx" ON "_about_v_version_icons_items" USING btree ("icon_id");
  CREATE INDEX "_about_v_version_vision_cards_order_idx" ON "_about_v_version_vision_cards" USING btree ("_order");
  CREATE INDEX "_about_v_version_vision_cards_parent_id_idx" ON "_about_v_version_vision_cards" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_values_items_order_idx" ON "_about_v_version_values_items" USING btree ("_order");
  CREATE INDEX "_about_v_version_values_items_parent_id_idx" ON "_about_v_version_values_items" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_team_top_row_order_idx" ON "_about_v_version_team_top_row" USING btree ("_order");
  CREATE INDEX "_about_v_version_team_top_row_parent_id_idx" ON "_about_v_version_team_top_row" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_team_top_row_photo_idx" ON "_about_v_version_team_top_row" USING btree ("photo_id");
  CREATE INDEX "_about_v_version_team_bottom_row_order_idx" ON "_about_v_version_team_bottom_row" USING btree ("_order");
  CREATE INDEX "_about_v_version_team_bottom_row_parent_id_idx" ON "_about_v_version_team_bottom_row" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_team_bottom_row_photo_idx" ON "_about_v_version_team_bottom_row" USING btree ("photo_id");
  CREATE INDEX "_about_v_version_story_milestones_order_idx" ON "_about_v_version_story_milestones" USING btree ("_order");
  CREATE INDEX "_about_v_version_story_milestones_parent_id_idx" ON "_about_v_version_story_milestones" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_hero_version_hero_video_idx" ON "_about_v" USING btree ("version_hero_video_id");
  CREATE INDEX "_about_v_version_vision_version_vision_video_idx" ON "_about_v" USING btree ("version_vision_video_id");
  CREATE INDEX "_about_v_version_meta_version_meta_image_idx" ON "_about_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_about_v_created_at_idx" ON "_about_v" USING btree ("created_at");
  CREATE INDEX "_about_v_updated_at_idx" ON "_about_v" USING btree ("updated_at");
  CREATE INDEX "lobby_page_page_video_idx" ON "lobby" USING btree ("page_video_id");
  CREATE INDEX "lobby_meta_meta_image_idx" ON "lobby" USING btree ("meta_image_id");
  CREATE INDEX "_lobby_v_version_page_version_page_video_idx" ON "_lobby_v" USING btree ("version_page_video_id");
  CREATE INDEX "_lobby_v_version_meta_version_meta_image_idx" ON "_lobby_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_lobby_v_created_at_idx" ON "_lobby_v" USING btree ("created_at");
  CREATE INDEX "_lobby_v_updated_at_idx" ON "_lobby_v" USING btree ("updated_at");
  CREATE INDEX "social_cards_items_order_idx" ON "social_cards_items" USING btree ("_order");
  CREATE INDEX "social_cards_items_parent_id_idx" ON "social_cards_items" USING btree ("_parent_id");
  CREATE INDEX "social_cards_items_icon_idx" ON "social_cards_items" USING btree ("icon_id");
  CREATE INDEX "social_carousel_row1_order_idx" ON "social_carousel_row1" USING btree ("_order");
  CREATE INDEX "social_carousel_row1_parent_id_idx" ON "social_carousel_row1" USING btree ("_parent_id");
  CREATE INDEX "social_carousel_row1_image_idx" ON "social_carousel_row1" USING btree ("image_id");
  CREATE INDEX "social_carousel_row2_order_idx" ON "social_carousel_row2" USING btree ("_order");
  CREATE INDEX "social_carousel_row2_parent_id_idx" ON "social_carousel_row2" USING btree ("_parent_id");
  CREATE INDEX "social_carousel_row2_image_idx" ON "social_carousel_row2" USING btree ("image_id");
  CREATE INDEX "social_hero_hero_video_idx" ON "social" USING btree ("hero_video_id");
  CREATE INDEX "social_meta_meta_image_idx" ON "social" USING btree ("meta_image_id");
  CREATE INDEX "_social_v_version_cards_items_order_idx" ON "_social_v_version_cards_items" USING btree ("_order");
  CREATE INDEX "_social_v_version_cards_items_parent_id_idx" ON "_social_v_version_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_social_v_version_cards_items_icon_idx" ON "_social_v_version_cards_items" USING btree ("icon_id");
  CREATE INDEX "_social_v_version_carousel_row1_order_idx" ON "_social_v_version_carousel_row1" USING btree ("_order");
  CREATE INDEX "_social_v_version_carousel_row1_parent_id_idx" ON "_social_v_version_carousel_row1" USING btree ("_parent_id");
  CREATE INDEX "_social_v_version_carousel_row1_image_idx" ON "_social_v_version_carousel_row1" USING btree ("image_id");
  CREATE INDEX "_social_v_version_carousel_row2_order_idx" ON "_social_v_version_carousel_row2" USING btree ("_order");
  CREATE INDEX "_social_v_version_carousel_row2_parent_id_idx" ON "_social_v_version_carousel_row2" USING btree ("_parent_id");
  CREATE INDEX "_social_v_version_carousel_row2_image_idx" ON "_social_v_version_carousel_row2" USING btree ("image_id");
  CREATE INDEX "_social_v_version_hero_version_hero_video_idx" ON "_social_v" USING btree ("version_hero_video_id");
  CREATE INDEX "_social_v_version_meta_version_meta_image_idx" ON "_social_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_social_v_created_at_idx" ON "_social_v" USING btree ("created_at");
  CREATE INDEX "_social_v_updated_at_idx" ON "_social_v" USING btree ("updated_at");
  CREATE INDEX "contact_page_page_video_idx" ON "contact" USING btree ("page_video_id");
  CREATE INDEX "contact_meta_meta_image_idx" ON "contact" USING btree ("meta_image_id");
  CREATE INDEX "_contact_v_version_page_version_page_video_idx" ON "_contact_v" USING btree ("version_page_video_id");
  CREATE INDEX "_contact_v_version_meta_version_meta_image_idx" ON "_contact_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_contact_v_created_at_idx" ON "_contact_v" USING btree ("created_at");
  CREATE INDEX "_contact_v_updated_at_idx" ON "_contact_v" USING btree ("updated_at");
  CREATE INDEX "accessibility_page_contacts_order_idx" ON "accessibility_page_contacts" USING btree ("_order");
  CREATE INDEX "accessibility_page_contacts_parent_id_idx" ON "accessibility_page_contacts" USING btree ("_parent_id");
  CREATE INDEX "accessibility_meta_meta_image_idx" ON "accessibility" USING btree ("meta_image_id");
  CREATE INDEX "_accessibility_v_version_page_contacts_order_idx" ON "_accessibility_v_version_page_contacts" USING btree ("_order");
  CREATE INDEX "_accessibility_v_version_page_contacts_parent_id_idx" ON "_accessibility_v_version_page_contacts" USING btree ("_parent_id");
  CREATE INDEX "_accessibility_v_version_meta_version_meta_image_idx" ON "_accessibility_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_accessibility_v_created_at_idx" ON "_accessibility_v" USING btree ("created_at");
  CREATE INDEX "_accessibility_v_updated_at_idx" ON "_accessibility_v" USING btree ("updated_at");
  CREATE INDEX "privacy_meta_meta_image_idx" ON "privacy" USING btree ("meta_image_id");
  CREATE INDEX "_privacy_v_version_meta_version_meta_image_idx" ON "_privacy_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_privacy_v_created_at_idx" ON "_privacy_v" USING btree ("created_at");
  CREATE INDEX "_privacy_v_updated_at_idx" ON "_privacy_v" USING btree ("updated_at");
  ALTER TABLE "divisions" ADD CONSTRAINT "divisions_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "divisions_meta_meta_image_idx" ON "divisions" USING btree ("meta_image_id");`)

  // Fill the new globals with the site's current content, in this transaction.
  await seedContent(payload, req)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_header_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_footer_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_footer_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_footer_legal" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_header_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_footer_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_footer_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_footer_legal" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_divisions_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_partners_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_divisions_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_partners_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_hero_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_icons_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_vision_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_values_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_team_top_row" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_team_bottom_row" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_story_milestones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_v_version_hero_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_v_version_icons_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_v_version_vision_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_v_version_values_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_v_version_team_top_row" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_v_version_team_bottom_row" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_v_version_story_milestones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lobby" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_lobby_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social_carousel_row1" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social_carousel_row2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_social_v_version_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_social_v_version_carousel_row1" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_social_v_version_carousel_row2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_social_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "accessibility_page_contacts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "accessibility" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_accessibility_v_version_page_contacts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_accessibility_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "privacy" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_privacy_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_header_nav" CASCADE;
  DROP TABLE "site_settings_footer_nav" CASCADE;
  DROP TABLE "site_settings_footer_social" CASCADE;
  DROP TABLE "site_settings_footer_legal" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "_site_settings_v_version_header_nav" CASCADE;
  DROP TABLE "_site_settings_v_version_footer_nav" CASCADE;
  DROP TABLE "_site_settings_v_version_footer_social" CASCADE;
  DROP TABLE "_site_settings_v_version_footer_legal" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "home_divisions_slides" CASCADE;
  DROP TABLE "home_stats_items" CASCADE;
  DROP TABLE "home_partners_logos" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "_home_v_version_divisions_slides" CASCADE;
  DROP TABLE "_home_v_version_stats_items" CASCADE;
  DROP TABLE "_home_v_version_partners_logos" CASCADE;
  DROP TABLE "_home_v" CASCADE;
  DROP TABLE "about_hero_steps" CASCADE;
  DROP TABLE "about_icons_items" CASCADE;
  DROP TABLE "about_vision_cards" CASCADE;
  DROP TABLE "about_values_items" CASCADE;
  DROP TABLE "about_team_top_row" CASCADE;
  DROP TABLE "about_team_bottom_row" CASCADE;
  DROP TABLE "about_story_milestones" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "_about_v_version_hero_steps" CASCADE;
  DROP TABLE "_about_v_version_icons_items" CASCADE;
  DROP TABLE "_about_v_version_vision_cards" CASCADE;
  DROP TABLE "_about_v_version_values_items" CASCADE;
  DROP TABLE "_about_v_version_team_top_row" CASCADE;
  DROP TABLE "_about_v_version_team_bottom_row" CASCADE;
  DROP TABLE "_about_v_version_story_milestones" CASCADE;
  DROP TABLE "_about_v" CASCADE;
  DROP TABLE "lobby" CASCADE;
  DROP TABLE "_lobby_v" CASCADE;
  DROP TABLE "social_cards_items" CASCADE;
  DROP TABLE "social_carousel_row1" CASCADE;
  DROP TABLE "social_carousel_row2" CASCADE;
  DROP TABLE "social" CASCADE;
  DROP TABLE "_social_v_version_cards_items" CASCADE;
  DROP TABLE "_social_v_version_carousel_row1" CASCADE;
  DROP TABLE "_social_v_version_carousel_row2" CASCADE;
  DROP TABLE "_social_v" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TABLE "_contact_v" CASCADE;
  DROP TABLE "accessibility_page_contacts" CASCADE;
  DROP TABLE "accessibility" CASCADE;
  DROP TABLE "_accessibility_v_version_page_contacts" CASCADE;
  DROP TABLE "_accessibility_v" CASCADE;
  DROP TABLE "privacy" CASCADE;
  DROP TABLE "_privacy_v" CASCADE;
  ALTER TABLE "divisions" DROP CONSTRAINT "divisions_meta_image_id_media_id_fk";
  
  DROP INDEX "divisions_meta_meta_image_idx";
  ALTER TABLE "divisions" DROP COLUMN "meta_title";
  ALTER TABLE "divisions" DROP COLUMN "meta_description";
  ALTER TABLE "divisions" DROP COLUMN "meta_image_id";
  ALTER TABLE "divisions" DROP COLUMN "meta_noindex";`)
}
