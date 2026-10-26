import { db } from "@/lib/storage/db";
import { METADATA_ID } from "@/lib/storage/metadata";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

export async function updateStudent(
  student: SpreadsheetStudentType
): Promise<number> {
  return await db.transaction("rw", db.students, db.metadata, async () => {
    const id = await db.students.put({ ...student });

    const updatedMetadata = await db.metadata.update(METADATA_ID, {
      lastModifiedAt: new Date().toISOString(),
    });

    if (updatedMetadata === 0) {
      throw new Error("Metadados não encontrados.");
    }

    return id;
  });
}
