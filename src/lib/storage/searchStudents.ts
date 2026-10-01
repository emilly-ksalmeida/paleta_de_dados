import { db } from "@/lib/storage/db";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

export async function searchStudentsByName(name: string): Promise<SpreadsheetStudentType[]> {
 return await db.students.where("nome_completo").startsWith(name).toArray();
}
