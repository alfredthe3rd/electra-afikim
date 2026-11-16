import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_submissions_email_status" AS ENUM('sent', 'failed', 'no-recipients', 'no-smtp');
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar,
  	"handled" boolean DEFAULT false,
  	"email_status" "enum_contact_submissions_email_status",
  	"email_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_inbox" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"recipients" varchar NOT NULL,
  	"email_subject" varchar NOT NULL,
  	"error_label" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_submissions_id" integer;
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");`)

  // Starting settings, written as SQL rather than through the Local API so this
  // migration keeps working after later schema changes.
  await db.execute(sql`
    INSERT INTO "contact_inbox" ("recipients", "email_subject", "error_label", "updated_at", "created_at")
    VALUES (
      'alfred@sivan-group.com',
      'פנייה חדשה מאתר אלקטרה אפיקים',
      'השליחה לא הצליחה. אפשר לנסות שוב בעוד כמה דקות או להתקשר אלינו.',
      now(),
      now()
    );`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk";
  DROP INDEX "payload_locked_documents_rels_contact_submissions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_submissions_id";
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "contact_inbox" CASCADE;
  DROP TYPE "public"."enum_contact_submissions_email_status";`)
}
