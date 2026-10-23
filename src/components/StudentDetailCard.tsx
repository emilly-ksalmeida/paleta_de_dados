import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

import FeedbackMessage from "@/components/FeedbackMessage";
import { StudentEditForm } from "@/components/StudentEditForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/InfoRow";
import { formatBirthDate } from "@/lib/format/birthDate";
import { formatDisplayName } from "@/lib/format/displayName";
import getStudentCourseClass from "@/lib/spreadsheet/getStudentCourse";
import type { StudentRecordType } from "@/types/studentRecordType";

const SAVE_FEEDBACK_DURATION_MS = 5000;

interface StudentSaveFeedback {
  studentId: number;
  message: string;
}

interface StudentDetailCardProps {
  selectedStudent: StudentRecordType | null;
  onStudentUpdated: (student: StudentRecordType) => void;
}

export function StudentDetailCard({
  selectedStudent,
  onStudentUpdated,
}: StudentDetailCardProps) {
  const [editingStudent, setEditingStudent] =
    useState<StudentRecordType | null>(null);
  const [saveFeedback, setSaveFeedback] =
    useState<StudentSaveFeedback | null>(null);
  const isEditing =
    selectedStudent !== null && editingStudent === selectedStudent;

  useEffect(() => {
    if (!saveFeedback) return;

    const timer = window.setTimeout(
      () => setSaveFeedback(null),
      SAVE_FEEDBACK_DURATION_MS,
    );

    return () => window.clearTimeout(timer);
  }, [saveFeedback]);

  const visibleSaveFeedback =
    saveFeedback && saveFeedback.studentId === selectedStudent?.id
      ? saveFeedback.message
      : null;

  const photoUrl = selectedStudent?.foto_3x4?.trim() ?? "";
  const healthInformationUrl = selectedStudent?.laudo_medico?.trim() ?? "";
  const courseClass = getStudentCourseClass(selectedStudent);

  return (
    <Card className="mx-auto max-w-[800px] overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-border bg-success-light px-6 py-4">
        <div>
          <h2
            id="dados-heading"
            className="text-xs font-bold uppercase tracking-widest text-success"
          >
            Informações do aluno
          </h2>
          {selectedStudent ? (
            <p className="mt-0.5 text-lg font-bold text-foreground">
              {formatDisplayName(selectedStudent.nome_completo)}
            </p>
          ) : (
            <p className="mt-0.5 text-lg font-semibold text-muted-foreground">
              Nenhum aluno selecionado
            </p>
          )}
        </div>
        {selectedStudent && !isEditing ? (
          <Button
            type="button"
            variant="outline"
            size="default"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Editar dados do aluno"
            title="Editar dados do aluno"
            onClick={() => {
              setSaveFeedback(null);
              setEditingStudent(selectedStudent);
            }}
          >
            <Pencil aria-hidden="true" />
            Editar
          </Button>
        ) : null}
      </div>
      <div className="px-6 py-5">
        {visibleSaveFeedback ? (
          <FeedbackMessage
            tone="success"
            message={visibleSaveFeedback}
            role="status"
            aria-live="polite"
            className="mb-4"
          />
        ) : null}

        {isEditing && selectedStudent ? (
          <StudentEditForm
            selectedStudent={selectedStudent}
            onCancel={() => setEditingStudent(null)}
            onSaved={(student) => {
              setEditingStudent(null);
              onStudentUpdated(student);
              setSaveFeedback({
                studentId: student.id,
                message: "Dados do aluno atualizados com sucesso.",
              });
            }}
          />
        ) : !selectedStudent ? (
          <div className="rounded-lg border border-muted bg-muted/50 p-4 text-sm text-muted-foreground">
            Selecione um aluno nos resultados para ver seus dados principais.
          </div>
        ) : (
          <>
            <dl className="space-y-3.5">
              <InfoRow
                label="Telefone"
                value={selectedStudent.telefone_para_contato.trim()}
              />
              <InfoRow
                label="Responsável"
                value={selectedStudent.nome_mae_ou_responsavel.trim()}
              />
              <InfoRow
                label="Telefone do responsável"
                value={selectedStudent.telefone_responsavel.trim()}
              />
              <InfoRow
                label="Data de nascimento"
                value={formatBirthDate(selectedStudent.data_nascimento)}
              />
              <div className="flex gap-2">
                <InfoRow label="Curso" value={courseClass.studentCourse} />
                <InfoRow label="Turma" value={courseClass.studentClass} />
              </div>
              <InfoRow
                label="Informações médicas"
                value={(selectedStudent.informacoes_saude ?? "").trim()}
              />
            </dl>
            <div className="mt-5 flex gap-2 border-t border-border pt-4">
              {photoUrl ? (
                <Button asChild variant="outline" className="flex-1">
                  <a href={photoUrl} target="_blank" rel="noopener noreferrer">
                    Visualizar foto
                  </a>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled
                >
                  Visualizar foto
                </Button>
              )}

              {healthInformationUrl ? (
                <Button asChild variant="outline" className="flex-1">
                  <a
                    href={healthInformationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visualizar laudo
                  </a>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled
                >
                  Visualizar laudo
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
