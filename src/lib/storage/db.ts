import { Dexie, type EntityTable } from "dexie";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

const db = new Dexie("StudentsDatabase") as Dexie & {
  students: EntityTable<SpreadsheetStudentType>;
};

db.version(1).stores({
  students: "++, nome_completo" 
});

export { db };
