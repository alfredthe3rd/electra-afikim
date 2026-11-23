import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_divisions_slides_video_focus" AS ENUM('center', 'top', 'bottom');
  CREATE TYPE "public"."enum__home_v_version_divisions_slides_video_focus" AS ENUM('center', 'top', 'bottom');
  ALTER TABLE "home_divisions_slides" ADD COLUMN "video_focus" "enum_home_divisions_slides_video_focus" DEFAULT 'center';
  ALTER TABLE "_home_v_version_divisions_slides" ADD COLUMN "video_focus" "enum__home_v_version_divisions_slides_video_focus" DEFAULT 'center';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_divisions_slides" DROP COLUMN "video_focus";
  ALTER TABLE "_home_v_version_divisions_slides" DROP COLUMN "video_focus";
  DROP TYPE "public"."enum_home_divisions_slides_video_focus";
  DROP TYPE "public"."enum__home_v_version_divisions_slides_video_focus";`)
}
