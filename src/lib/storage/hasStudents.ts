import { db } from "@/lib/storage/db";

export async function hasStudents(): Promise<boolean> {
  const firstStudent = await db.students.limit(1).toArray();
  return firstStudent.length > 0;
}
