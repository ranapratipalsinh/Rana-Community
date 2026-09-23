import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "villages" ADD COLUMN "original_family_tree_image_id" integer;
  ALTER TABLE "_villages_v" ADD COLUMN "version_original_family_tree_image_id" integer;
  ALTER TABLE "villages" ADD CONSTRAINT "villages_original_family_tree_image_id_media_id_fk" FOREIGN KEY ("original_family_tree_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_villages_v" ADD CONSTRAINT "_villages_v_version_original_family_tree_image_id_media_id_fk" FOREIGN KEY ("version_original_family_tree_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "villages_original_family_tree_image_idx" ON "villages" USING btree ("original_family_tree_image_id");
  CREATE INDEX "_villages_v_version_version_original_family_tree_image_idx" ON "_villages_v" USING btree ("version_original_family_tree_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "villages" DROP CONSTRAINT "villages_original_family_tree_image_id_media_id_fk";
  
  ALTER TABLE "_villages_v" DROP CONSTRAINT "_villages_v_version_original_family_tree_image_id_media_id_fk";
  
  DROP INDEX "villages_original_family_tree_image_idx";
  DROP INDEX "_villages_v_version_version_original_family_tree_image_idx";
  ALTER TABLE "villages" DROP COLUMN "original_family_tree_image_id";
  ALTER TABLE "_villages_v" DROP COLUMN "version_original_family_tree_image_id";`)
}
