import type { SpreadsheetStudentType } from "./spreadsheetStudentType";

export type ParseSpreadsheetResult =
  | { success: true; message: SpreadsheetStudentType[] }
  | { success: false; message: string[] };
