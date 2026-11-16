import { normalizeKey } from "@/lib/format/normalizeKey";
import { db } from "@/lib/storage/db";
import type { StudentRecordType } from "@/types/studentRecordType";

export async function findStudentsByExactFullName(
  name: string,
): Promise<StudentRecordType[]> {
  const normalizedName = normalizeKey(name);

  return await db.students
    .where("nome_completo")
    .equals(normalizedName)
    .toArray();
}
