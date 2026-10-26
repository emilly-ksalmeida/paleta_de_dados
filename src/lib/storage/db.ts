import { Dexie, type EntityTable } from "dexie";
import type { MetadataRecordType } from "@/lib/storage/metadata";
import type { StudentRecordType } from "@/types/studentRecordType";

const db = new Dexie("StudentsDatabase") as Dexie & {
  students: EntityTable<StudentRecordType, "id">;
  metadata: EntityTable<MetadataRecordType, "id">;
};

db.version(2).stores({
  students: "++id, nome_completo",
  metadata: "id",
});

export { db };
