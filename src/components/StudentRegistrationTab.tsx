import { useEffect, useRef, useState } from "react";

import FeedbackMessage from "@/components/FeedbackMessage";
import { StudentCreateForm } from "@/components/StudentCreateForm";
import { formatDisplayName } from "@/lib/format/displayName";
import { normalizeKey } from "@/lib/format/normalizeKey";
import { scrollToElement } from "@/lib/scroll/scrollToElement";
import { addStudent } from "@/lib/storage/addStudent";
import { getMetadata } from "@/lib/storage/metadata";
import type { StudentFormValues } from "@/schemas/studentFormSchema";
import type { StatusTone } from "@/types/component.types";

interface RegistrationFeedback {
  tone: StatusTone;
  message: string;
}

export function StudentRegistrationTab() {
  const [feedback, setFeedback] = useState<RegistrationFeedback | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback?.tone !== "success") {
      return;
    }

    scrollToElement(panelRef.current);
  }, [feedback]);

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

      <StudentCreateForm onSubmit={createStudent} />
    </div>
  );
}
