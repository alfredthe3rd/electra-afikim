import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_inbox" ADD COLUMN "public_email" varchar;`)

  // Client request (Ayelet Shenhar, 2.11.2026): the contact form goes to
  // appeals@afikim-t.co.il, the address is shown on the contact page, and the
  // phone is 073-2014000 instead of *6686. Each value is replaced only while it
  // still holds the earlier default, so edits made in the panel are kept.
  await db.execute(sql`
    UPDATE "contact_inbox" SET "public_email" = 'appeals@afikim-t.co.il' WHERE "public_email" IS NULL;
    UPDATE "contact_inbox" SET "recipients" = 'appeals@afikim-t.co.il' WHERE "recipients" = 'alfred@sivan-group.com';
    UPDATE "site_settings" SET
      "contact_details_phone_label" = '073-2014000',
      "contact_details_dial_cta_label" = 'חייגו 073-2014000',
      "contact_details_dial_href" = 'tel:0732014000'
    WHERE "contact_details_dial_href" = 'tel:*6686';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_inbox" DROP COLUMN "public_email";`)
}
