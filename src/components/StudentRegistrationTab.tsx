import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import FeedbackMessage from "@/components/FeedbackMessage";
import { StudentCreateForm } from "@/components/StudentCreateForm";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatDisplayName } from "@/lib/format/displayName";
import { normalizeKey } from "@/lib/format/normalizeKey";
import { scrollToElement } from "@/lib/scroll/scrollToElement";
import { addStudent } from "@/lib/storage/addStudent";
import { findStudentsByExactFullName } from "@/lib/storage/findStudentsByExactFullName";
import { getMetadata } from "@/lib/storage/metadata";
import type { StudentFormValues } from "@/schemas/studentFormSchema";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";
import type { StatusTone } from "@/types/component.types";
import type { StudentRecordType } from "@/types/studentRecordType";

interface RegistrationFeedback {
  tone: StatusTone;
  message: string;
}

export function StudentRegistrationTab() {
  const [feedback, setFeedback] = useState<RegistrationFeedback | null>(null);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [pendingStudent, setPendingStudent] =
    useState<SpreadsheetStudentType | null>(null);
  const [duplicateStudents, setDuplicateStudents] = useState<StudentRecordType[]>(
    [],
  );
  const [isConfirmingDuplicate, setIsConfirmingDuplicate] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback?.tone !== "success") {
      return;
    }

    scrollToElement(panelRef.current);
  }, [feedback]);

  async function saveStudent(
    student: SpreadsheetStudentType,
  ): Promise<boolean> {
    try {
      await addStudent(student);
      setFeedback({
        tone: "success",
        message: `Aluno ${formatDisplayName(student.nome_completo)} cadastrado com sucesso.`,
      });
      return true;
    } catch {
      setFeedback({
        tone: "error",
        message: "Não foi possível cadastrar o aluno. Tente novamente.",
      });
      return false;
    }
  }

  async function createStudent(data: StudentFormValues): Promise<boolean> {
    setFeedback(null);

    const metadata = await getMetadata();

    if (!metadata) {
      setFeedback({
        tone: "warning",
        message: "Carregue a planilha antes de cadastrar um aluno.",
      });
      return false;
    }

    const student = {
      ...data,
      nome_completo: normalizeKey(data.nome_completo),
    };

    const duplicates = await findStudentsByExactFullName(data.nome_completo);

    if (duplicates.length > 0) {
      setPendingStudent(student);
      setDuplicateStudents(duplicates);
      setIsDuplicateDialogOpen(true);
      return false;
    }

    return await saveStudent(student);
  }

  function handleCancelDuplicate() {
    setIsDuplicateDialogOpen(false);
    setPendingStudent(null);
    setDuplicateStudents([]);
  }

  async function handleConfirmDuplicate() {
    if (!pendingStudent || isConfirmingDuplicate) {
      return;
    }

    setIsConfirmingDuplicate(true);

    const didSave = await saveStudent(pendingStudent);

    setIsConfirmingDuplicate(false);

    if (didSave) {
      setIsDuplicateDialogOpen(false);
      setPendingStudent(null);
      setDuplicateStudents([]);
      setFormKey((value) => value + 1);
    }
  }

  return (
    <div ref={panelRef} className="scroll-mt-4 flex flex-col gap-4">
      {feedback ? (
        <FeedbackMessage
          tone={feedback.tone}
          message={feedback.message}
          role={feedback.tone === "error" ? "alert" : "status"}
          aria-live={feedback.tone === "error" ? "assertive" : "polite"}
        />
      ) : null}

      <StudentCreateForm key={formKey} onSubmit={createStudent} />

      <AlertDialog
        open={isDuplicateDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isConfirmingDuplicate) {
            handleCancelDuplicate();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Possível aluno duplicado</AlertDialogTitle>
            <AlertDialogDescription>
              Já existe um aluno cadastrado com este nome. Verifique se é a
              mesma pessoa antes de continuar.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex max-h-60 flex-col gap-2 overflow-y-auto">
            {duplicateStudents.map((student, index) => (
              <div
                key={student.id ?? `${student.nome_completo}-${index}`}
                className="rounded-md border p-3 text-sm"
              >
                <p className="font-bold">
                  {formatDisplayName(student.nome_completo)}
                </p>
              </div>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isConfirmingDuplicate}
              onClick={handleCancelDuplicate}
            >
              Cancelar
            </AlertDialogCancel>
            <Button
              type="button"
              disabled={isConfirmingDuplicate}
              onClick={() => {
                void handleConfirmDuplicate();
              }}
            >
              {isConfirmingDuplicate ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : null}
              {isConfirmingDuplicate
                ? "Cadastrando..."
                : "Cadastrar mesmo assim"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
