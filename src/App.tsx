import { useEffect, useState, type ChangeEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { SpreadsheetUploadCard } from "./components/SpreadsheetUploadCard";
import { StudentDetailCard } from "./components/StudentDetailCard";
import { StudentSearchArea } from "./components/StudentSearchArea";
import { StudentSearchResults } from "./components/StudentSearchResults";
import { Header } from "./components/Header";

import { normalizeKey, parseSpreadsheetFile } from "@/lib/spreadsheet/spreadsheet";
import {
  formatUploadTimestamp,
  getLastUploadAt,
  setLastUploadAt,
} from "@/lib/storage/uploadMetadata";
import { addStudents } from "./lib/storage/addStudents";
import { hasStudents } from "./lib/storage/hasStudents";
import { searchStudentsByName } from "./lib/storage/searchStudents";

import type { StatusTone } from "./types/component.types";
import type { SpreadsheetStudentType } from "./types/spreadsheetStudentType";


export default function App() {
  // estilo
  const [statusTone, setStatusTone] = useState<StatusTone>("warning");

  // UPLOAD
  const [isOpen, setIsOpen] = useState(true);
  //nome da planilha selecionada
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // mensagem de status para upload
  const [statusMessage, setStatusMessage] = useState(
    "Carregue a planilha para liberar a busca.",
  );

  // status do parse da planilha
  const [isParsing, setIsParsing] = useState(false);

  // salvar data e hora do último upload
  const [persistedUploadAt, setPersistedUploadAt] = useState(
    () => getLastUploadAt() ?? "",
  );

  // verifica se tem dados no banco
  useEffect(() => {
    async function checkStoredStudents() {
      const exists = await hasStudents();
     
      if (exists) {
        setStatusTone("default");
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
      const result = await parseSpreadsheetFile(file);

      if (!result.success) {
        setSelectedFileName(file.name);
        setStatusTone("error");
        setStatusMessage(
          `Coluna(s) obrigatória(s) ausente(s): ${result.message.join(", ")}.`,
        );
        return;
      }

      const currentUploadAt = new Date().toISOString();

      //Adicionando ao banco IndexedDB
      await addStudents(result.message);

      setSelectedFileName(file.name);
      setPersistedUploadAt(currentUploadAt);
      setLastUploadAt(currentUploadAt);
      setStatusTone("success");
      setStatusMessage(
        `${result.message.length} registro(s) carregado(s) da planilha.`,
      );
    } catch {
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

  // AREA DE BUSCA

  const [selectedStudent, setSelectedStudent] =
    useState<SpreadsheetStudentType | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredStudents = useLiveQuery(async () => {
    if (!searchTerm) return [];
    const students = await searchStudentsByName(normalizeKey(searchTerm));
    return students;
  }, [searchTerm]);

  return (
    <div>
      <Header />

      <main className="container mx-auto flex flex-col gap-5 pt-5">
        <section
          aria-labelledby="upload-heading"
          className="flex flex-col gap-5 rounded-xl border bg-card px-8 py-4 shadow"
        >
          <SpreadsheetUploadCard
            selectedFileName={selectedFileName}
            isParsing={isParsing}
            statusMessage={statusMessage}
            statusTone={statusTone}
            lastUploadLabel={lastUploadLabel}
            onFileChange={handleFileChange}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </section>

        <section
          aria-labelledby="busca-heading"
          className="flex flex-col gap-5 rounded-xl border bg-card p-8 shadow"
        >
          <StudentSearchArea
            setSearchTerm={setSearchTerm}
            statusMessage={statusMessage}
            setIsOpen={setIsOpen}
          />

          <StudentSearchResults
            filteredStudents={filteredStudents}
            searchTerm={searchTerm}
            setSelectedStudent={setSelectedStudent}
          />
        </section>

        <section aria-labelledby="dados-heading">
          <StudentDetailCard selectedStudent={selectedStudent} />
        </section>
      </main>
    </div>
  );
}
