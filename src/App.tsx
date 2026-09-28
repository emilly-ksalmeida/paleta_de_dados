import { useEffect, useState, type ChangeEvent } from "react";

import { SpreadsheetUploadCard } from "./components/SpreadsheetUploadCard";
import { Header } from "./components/Header";

import { parseSpreadsheetFile } from "@/lib/spreadsheet/spreadsheet";
import {
  formatUploadTimestamp,
  getLastUploadAt,
  setLastUploadAt,
} from "@/lib/storage/uploadMetadata";
import { addStudents } from "./lib/storage/addStudents";
import { hasStudents } from "./lib/storage/hasStudents";

import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";
import type { StatusTone } from "./types/component.types";
import { listAll } from "./lib/storage/listAll";

export default function App() {
  //dados extraídos da planilha upload
  const [rawSpreadsheetData, setRawSpreadsheetData] = useState<
    SpreadsheetStudentType[]
  >([]);

  //nome da planilha selecionada
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const [statusMessage, setStatusMessage] = useState(
    "Carregue a planilha para liberar a busca.",
  );
  const [statusTone, setStatusTone] = useState<StatusTone>("warning");

  const [isParsing, setIsParsing] = useState(false);

  const [persistedUploadAt, setPersistedUploadAt] = useState(
    () => getLastUploadAt() ?? "",
  );

  const [hasStoredStudents, setHasStoredStudents] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    async function checkStoredStudents() {
      const exists = await hasStudents();
      setHasStoredStudents(exists);
      
      if (exists) {
        setStatusTone("default");
        const students = await listAll();
        setRawSpreadsheetData(students);
        setStatusMessage("Dados carregados. Busca liberada.");
      } else {
        setStatusTone("warning");
        setStatusMessage("Carregue a planilha para liberar a busca.");
      }
    }

    void checkStoredStudents();
  }, []);

  //Função para processar o upload da planilha e converter para objeto
  async function processSpreadsheetUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileName = file.name.toLowerCase();
    const isSupportedFile =
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".ods") ||
      fileName.endsWith(".csv");

    if (!isSupportedFile) {
      setRawSpreadsheetData([]);
      setSelectedFileName(file.name);
      setStatusTone("error");
      setStatusMessage(
        "Formato inválido. Use apenas arquivos .xlsx, .ods ou .csv.",
      );
      event.target.value = "";
      return;
    }

    setIsParsing(true);
    setStatusTone("default");
    setStatusMessage("Lendo planilha...");

    try {
      //momento que converte a planilha para objeto JSON
      const parsedRows = await parseSpreadsheetFile(file);
      console.log(parsedRows);

      if (parsedRows.length === 0) {
         throw Error("Esta planilha está vazia");
      }

      const currentUploadAt = new Date().toISOString();

      //Adicionando ao banco IndexedDB
      await addStudents(parsedRows);

      setRawSpreadsheetData(parsedRows);
      setSelectedFileName(file.name);
      setHasStoredStudents(true);
      setPersistedUploadAt(currentUploadAt);
      setLastUploadAt(currentUploadAt);
      setStatusTone("success");
      setStatusMessage(
        `${parsedRows.length} registro(s) carregado(s) da planilha.`,
      );
    } catch {
      setRawSpreadsheetData([]);
      setSelectedFileName(file.name);
      setStatusTone("error");
      setStatusMessage("Não foi possível ler a planilha enviada.");
    } finally {
      setIsParsing(false);
      event.target.value = "";
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    void processSpreadsheetUpload(event);
  }

  const lastUploadLabel = persistedUploadAt
    ? formatUploadTimestamp(persistedUploadAt)
    : "";

  const shouldWarnAboutMissingData =
    rawSpreadsheetData.length === 0 && Boolean(persistedUploadAt);

  return (
    <div>
      <Header />
      <main className="container mx-auto flex flex-col gap-5 pt-5">
        <section aria-labelledby="upload-heading">
          <SpreadsheetUploadCard
            selectedFileName={selectedFileName}
            isParsing={isParsing}
            statusMessage={statusMessage}
            statusTone={statusTone}
            lastUploadLabel={lastUploadLabel}
            shouldWarnAboutMissingData={shouldWarnAboutMissingData}
            onFileChange={handleFileChange}
          />
        </section>
        <section aria-labelledby="busca-heading">
          <h2 id="busca-heading">Área de busca</h2>
        </section>
        <aside aria-labelledby="resultados-heading">
          <h2 id="resultados-heading">Resultados da pesquisa</h2>
          {JSON.stringify(rawSpreadsheetData[0], null, 2)}
        </aside>
        <section aria-labelledby="dados-heading">
          <h2 id="dados-heading">Dados principais</h2>
        </section>
      </main>
    </div>
  );
}
