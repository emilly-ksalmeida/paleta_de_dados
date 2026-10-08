const NOT_INFORMED = "Não informado";

const EXCEL_EPOCH_UTC = Date.UTC(1899, 11, 30);
const EXCEL_SERIAL_MAX = 73415;

function daysInMonth(month: number, year: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function isValidDateParts(day: number, month: number, year: number): boolean {
  if (month < 1 || month > 12) {
    return false;
  }
  if (year < 1900 || year > 2099) {
    return false;
  }
  return day >= 1 && day <= daysInMonth(month, year);
}

function formatParts(day: number, month: number, year: number): string {
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

function fromExcelSerial(serial: number): string | null {
  if (!Number.isFinite(serial) || serial < 1 || serial > EXCEL_SERIAL_MAX) {
    return null;
  }

  const date = new Date(EXCEL_EPOCH_UTC + Math.floor(serial) * 86400000);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  if (!isValidDateParts(day, month, year)) {
    return null;
  }

  return formatParts(day, month, year);
}

export function formatBirthDate(value: string): string {
  const raw = value.trim();

  if (!raw) {
    return NOT_INFORMED;
  }

  const digits = raw.replace(/\D/g, "");

  if (digits.length === 8) {
    const day = Number(digits.slice(0, 2));
    const month = Number(digits.slice(2, 4));
    const year = Number(digits.slice(4, 8));

    if (isValidDateParts(day, month, year)) {
      return formatParts(day, month, year);
    }
  }

  if (digits.length === 6) {
    const day = Number(digits.slice(0, 2));
    const month = Number(digits.slice(2, 4));
    const twoDigitYear = Number(digits.slice(4, 6));
    const currentTwoDigitYear = new Date().getFullYear() % 100;
    const year =
      twoDigitYear <= currentTwoDigitYear
        ? 2000 + twoDigitYear
        : 1900 + twoDigitYear;

    if (isValidDateParts(day, month, year)) {
      return formatParts(day, month, year);
    }
  }

  if (/^\d+([.,]\d+)?$/.test(raw)) {
    const formatted = fromExcelSerial(Number(raw.replace(",", ".")));

    if (formatted) {
      return formatted;
    }
  }

  return NOT_INFORMED;
}
