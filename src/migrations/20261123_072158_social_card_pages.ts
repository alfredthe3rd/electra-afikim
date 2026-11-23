import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "social_cards_items" ADD COLUMN "details" jsonb;
  ALTER TABLE "social_cards_items" ADD COLUMN "slug" varchar;
  ALTER TABLE "social_cards_items" ADD COLUMN "more_label" varchar;
  ALTER TABLE "_social_v_version_cards_items" ADD COLUMN "details" jsonb;
  ALTER TABLE "_social_v_version_cards_items" ADD COLUMN "slug" varchar;
  ALTER TABLE "_social_v_version_cards_items" ADD COLUMN "more_label" varchar;`)

  // Client request (23.11.2026): each responsibility card gets a "read more"
  // page. Address the existing three by title so the pages have stable URLs
  // before their texts arrive; the button stays hidden until "details" is set.
  await db.execute(sql`
    UPDATE "social_cards_items" SET "slug" = 'environment' WHERE "slug" IS NULL AND "title" = 'אחריות סביבתית';
    UPDATE "social_cards_items" SET "slug" = 'community' WHERE "slug" IS NULL AND "title" = 'אחריות קהילתית';
    UPDATE "social_cards_items" SET "slug" = 'corporate' WHERE "slug" IS NULL AND "title" = 'אחריות תאגידית';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "social_cards_items" DROP COLUMN "details";
  ALTER TABLE "social_cards_items" DROP COLUMN "slug";
  ALTER TABLE "social_cards_items" DROP COLUMN "more_label";
  ALTER TABLE "_social_v_version_cards_items" DROP COLUMN "details";
  ALTER TABLE "_social_v_version_cards_items" DROP COLUMN "slug";
  ALTER TABLE "_social_v_version_cards_items" DROP COLUMN "more_label";`)
}
