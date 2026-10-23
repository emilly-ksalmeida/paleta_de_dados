import { TriangleAlert, Users } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDisplayName } from "@/lib/format/displayName";
import getStudentCourseClass from "@/lib/spreadsheet/getStudentCourse";
import type { StudentRecordType } from "@/types/studentRecordType";
import { Button } from "./ui/button";

interface StudentSearchResultsProps {
  filteredStudents?: StudentRecordType[];
  searchTerm: string;
  setSelectedStudent: React.Dispatch<
    React.SetStateAction<StudentRecordType | null>
  >;
}

export function StudentSearchResults({
  filteredStudents,
  searchTerm,
  setSelectedStudent,
}: StudentSearchResultsProps) {
  const students = filteredStudents ?? [];
  const hasSearched = searchTerm.trim().length > 0;
  const isLoading = filteredStudents === undefined;
  const isEmpty = students.length === 0;
  const hasResults = !isEmpty;
  const isNotFound = hasSearched && !isLoading && isEmpty;

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
        <ScrollArea className="h-52">
          <div className="flex flex-col gap-4 bg-muted px-10 py-5">
            {students.map((student) => {
              const courseClass = getStudentCourseClass(student);

              return (
                <Button
                  variant="outline"
                  key={student.id}
                  className="flex min-h-16 flex-col items-start justify-start"
                  onClick={() => setSelectedStudent(student)}
                >
                  <span>{formatDisplayName(student.nome_completo)}</span>
                  <span className="text-xs">
                    {courseClass.studentCourse || "—"} —{" "}
                    {courseClass.studentClass || "—"}
                  </span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      ) : isNotFound ? (
        <div className="flex items-start gap-3 rounded-md border border-warning bg-warning-light px-4 py-3 text-lg font-semibold text-warning">
          <TriangleAlert className="mt-1 size-6 shrink-0" aria-hidden="true" />
          <span>
            Nenhum aluno encontrado para{" "}
            <span className="font-bold underline underline-offset-4">
              {`"${searchTerm}"`}
            </span>
            .
          </span>
        </div>
      ) : (
        <p className="p-2 text-sm text-muted-foreground">{statusMessage}</p>
      )}
    </aside>
  );
}
