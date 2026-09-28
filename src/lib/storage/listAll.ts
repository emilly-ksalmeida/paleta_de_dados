import { db } from "@/lib/storage/db";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

export async function listAll(): Promise<SpreadsheetStudentType[]> {
  return await db.students.toArray();
}
