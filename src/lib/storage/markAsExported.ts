import { db } from "@/lib/storage/db";
import { METADATA_ID } from "@/lib/storage/metadata";

export async function markAsExported(): Promise<void> {
  await db.transaction("rw", db.metadata, async () => {
    const updatedMetadata = await db.metadata.update(METADATA_ID, {
      lastExportedAt: new Date().toISOString(),
    });

    if (updatedMetadata === 0) {
      throw new Error("Metadados não encontrados.");
    }
  });
}
