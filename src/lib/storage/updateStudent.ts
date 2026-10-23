import { db } from "@/lib/storage/db";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

export async function updateStudent(
  student: SpreadsheetStudentType
): Promise<number> {
  return await db.students.put({ ...student });
}
