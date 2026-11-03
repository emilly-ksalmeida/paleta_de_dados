import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import { StudentFormFields } from "@/components/StudentFormFields";
import { Button } from "@/components/ui/button";
import { normalizeKey } from "@/lib/format/normalizeKey";
import { getStudentFormDefaults } from "@/lib/studentForm/studentFormConfig";
import {
  studentFormSchema,
  type StudentFormValues,
} from "@/schemas/studentFormSchema";
import { updateStudent } from "@/lib/storage/updateStudent";
import type { StudentRecordType } from "@/types/studentRecordType";

interface StudentEditFormProps {
  selectedStudent: StudentRecordType;
  onCancel: () => void;
  onSaved: (student: StudentRecordType) => void;
}

export function StudentEditForm({
  selectedStudent,
  onCancel,
  onSaved,
}: StudentEditFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    mode: "onSubmit",
    defaultValues: getStudentFormDefaults(selectedStudent),
  });

  const submit: SubmitHandler<StudentFormValues> = async (data) => {
    const updatedStudent: StudentRecordType = {
      ...selectedStudent,
      ...data,
      nome_completo: normalizeKey(data.nome_completo),
    };

    try {
      setSubmitError(null);
      await updateStudent(updatedStudent);
      onSaved(updatedStudent);
    } catch {
      setSubmitError("Não foi possível salvar as alterações. Tente novamente.");
    }
  };

  return (
    <form
      className="flex flex-col"
      aria-label="Formulário de atualização de dados do aluno"
      onSubmit={(event) => {
        void handleSubmit(submit)(event);
      }}
    >
      <p aria-hidden="true" className="mb-2 text-sm text-muted-foreground">
        Campos com <span className="text-destructive">*</span> são obrigatórios.
      </p>
      <StudentFormFields
        register={register}
        errors={errors}
        idPrefix="student"
      />

      {submitError ? (
        <p role="alert" className="mt-4 text-lg text-destructive">
          {submitError}
        </p>
      ) : null}

      <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}
