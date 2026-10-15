export const LAST_UPLOAD_KEY = "paleta-de-dados:last-upload-at";
export const LAST_UPLOAD_FILE_NAME_KEY = "paleta-de-dados:last-upload-file-name";

export function getLastUploadAt(): string | null {
  return localStorage.getItem(LAST_UPLOAD_KEY);
}

export function setLastUploadAt(value: string): void {
  localStorage.setItem(LAST_UPLOAD_KEY, value);
}

export function getLastUploadFileName(): string | null {
  return localStorage.getItem(LAST_UPLOAD_FILE_NAME_KEY);
}

export function setLastUploadFileName(value: string): void {
  localStorage.setItem(LAST_UPLOAD_FILE_NAME_KEY, value);
}

export function formatUploadTimestamp(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
