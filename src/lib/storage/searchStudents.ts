import { db } from "@/lib/storage/db";
import type { StudentRecordType } from "@/types/studentRecordType";

export async function searchStudentsByName(
  name: string,
): Promise<StudentRecordType[]> {
  return await db.students.where("nome_completo").startsWith(name).toArray();
}
