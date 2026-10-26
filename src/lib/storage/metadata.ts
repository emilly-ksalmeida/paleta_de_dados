import { db } from "@/lib/storage/db";

export const METADATA_ID = "singleton";

export interface MetadataRecordType {
  id: typeof METADATA_ID;
  fileName: string;
  uploadedAt: string;
  lastModifiedAt: string;
  lastExportedAt: string | null;
}

export function createMetadata(
  fileName: string,
  uploadedAt: string,
): MetadataRecordType {
  return {
    id: METADATA_ID,
    fileName,
    uploadedAt,
    lastModifiedAt: uploadedAt,
    lastExportedAt: uploadedAt,
  };
}

export async function getMetadata(): Promise<MetadataRecordType | undefined> {
  return await db.metadata.get(METADATA_ID);
}

export async function putMetadata(metadata: MetadataRecordType): Promise<void> {
  await db.metadata.put(metadata);
}

export function deriveIsUnexported(
  metadata: MetadataRecordType | undefined,
): boolean {
  if (!metadata) {
    return false;
  }

  const { lastExportedAt, lastModifiedAt } = metadata;

  return lastExportedAt === null || lastModifiedAt > lastExportedAt;
}
