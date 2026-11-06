import { db } from "@/lib/storage/db";
import { createMetadata } from "@/lib/storage/metadata";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

interface UploadMetadata {
  fileName: string;
  uploadedAt: string;
}

export async function addStudents(
  studentList: SpreadsheetStudentType[],
  { fileName, uploadedAt }: UploadMetadata,
) {
  await db.delete();

  await db.open();

  return await db.transaction("rw", db.students, db.metadata, async () => {
    await db.students.clear();

    const idKeys = await db.students.bulkAdd(studentList, { allKeys: true });

    await db.metadata.put(createMetadata(fileName, uploadedAt));

    return idKeys;
  });
}
