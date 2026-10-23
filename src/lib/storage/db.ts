import { Dexie, type EntityTable } from "dexie";
import type { StudentRecordType } from "@/types/studentRecordType";

const db = new Dexie("StudentsDatabase") as Dexie & {
  students: EntityTable<StudentRecordType, "id">;
};

db.version(1).stores({
  students: "++id, nome_completo" //alteração necessária para se obter o id do registro no banco e esse id ser usado no processo de update
});

export { db };
