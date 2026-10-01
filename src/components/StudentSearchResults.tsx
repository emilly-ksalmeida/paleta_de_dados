import { Users } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

interface StudentSearchResultsProps {
  filteredStudents?: SpreadsheetStudentType[];
  searchTerm: string;
}

export function StudentSearchResults({
  filteredStudents,
  searchTerm,
}: StudentSearchResultsProps) {
  const students = filteredStudents ?? [];
  const hasSearched = searchTerm.trim().length > 0;
  const isLoading = filteredStudents === undefined;
  const isEmpty = students.length === 0;
  const hasResults = !isEmpty;

  const statusMessage = !hasSearched
    ? "Pesquise por um nome"
    : isLoading
      ? "Carregando resultados..."
      : isEmpty
        ? `Nenhum aluno encontrado para "${searchTerm}".`
        : `${students.length} aluno(s) encontrado(s) para "${searchTerm}".`;

  return (
    <aside
      aria-labelledby="resultados-heading"
      aria-busy={isLoading}
      className="flex flex-col gap-5 px-10"
    >
      <div className="flex flex-col gap-2">
        <h2 id="resultados-heading" className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" aria-hidden="true" />
          Resultados
        </h2>
        <p className="text-sm text-muted-foreground">
          Lista de correspondências encontradas na planilha:
        </p>
      </div>

      <p role="status" className="sr-only">
        {statusMessage}
      </p>

      {hasResults ? (
        <ScrollArea className="h-40">
          <div className="flex flex-col gap-4 bg-muted px-10 py-5">
            {students.map((student) => (
              <div
                className="rounded-lg border border-primary/30 bg-primary/10 p-2"
                key={`${student.nome_completo}-${student.telefone_para_contato}`}
              >
                <p>{student.nome_completo}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="p-2 text-sm text-muted-foreground">{statusMessage}</p>
      )}
    </aside>
  );
}
