import { db } from "@/lib/storage/db";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

export async function addStudents(studentList: SpreadsheetStudentType[]) {
    await db.delete();

    await db.open();

    const idKeys = await db.students.bulkAdd(studentList, { allKeys: true });

    return idKeys;
}
