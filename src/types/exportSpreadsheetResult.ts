export type ExportSpreadsheetResult =
  | { success: true; message: string; exportedCount: number }
  | { success: false; message: string };
