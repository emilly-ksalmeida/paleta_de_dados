import { format } from "date-fns";
import * as XLSX from "xlsx";

import { downloadBytesAsFile } from "@/lib/download/downloadFile";
import { listAll } from "@/lib/storage/listAllStudents";
import { markAsExported } from "@/lib/storage/markAsExported";
import { FIELD_ALIASES } from "@/lib/spreadsheet/spreadsheet";
import type { ExportSpreadsheetResult } from "@/types/exportSpreadsheetResult";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

const XLSX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const EXPORT_SHEET_NAME = "Alunos";

export function buildExportFileName(date: Date = new Date()): string {
  return `${format(date, "yyyy_MM_dd_HH_mm_ss")}_alunos.xlsx`;
}

export interface ExportColumn {
  field: keyof SpreadsheetStudentType;
  header: string;
}

export function getExportColumns(): ExportColumn[] {
  return Object.entries(FIELD_ALIASES).map(([field, aliases]) => ({
    field: field as keyof SpreadsheetStudentType,
    header: aliases[aliases.length - 1].trim(),
  }));
}

export async function exportStudentsToXlsx(): Promise<ExportSpreadsheetResult> {
  const students = await listAll();

  if (students.length === 0) {
    return {
      success: false,
      message: "Não há dados armazenados no navegador para exportar.",
    };
  }

  const columns = getExportColumns();

  const rows = students.map((student) =>
    Object.fromEntries(
      columns.map(({ field, header }) => [header, student[field] ?? ""]),
    ),
  );

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: columns.map((column) => column.header),
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, EXPORT_SHEET_NAME);

  const fileName = buildExportFileName();
  const bytes = XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
  }) as ArrayBuffer;

  downloadBytesAsFile(bytes, fileName, XLSX_MIME_TYPE);

  await markAsExported();

  return {
    success: true,
    message: `Download iniciado (${rows.length} registro(s)). Arquivo: ${fileName}`,
    exportedCount: rows.length,
  };
}
