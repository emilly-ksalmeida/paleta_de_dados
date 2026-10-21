const XLSX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// tempo de espera antes de revogar a URL do blob, evitando que o
// navegador cancele o download em andamento
const OBJECT_URL_TTL_MS = 60_000;

export function downloadBytesAsFile(
  bytes: ArrayBuffer,
  fileName: string,
): void {
  const blob = new Blob([bytes], { type: XLSX_MIME_TYPE });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, OBJECT_URL_TTL_MS);
}
