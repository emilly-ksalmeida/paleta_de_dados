import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { normalizeKey } from "@/lib/format/normalizeKey";
import {
  getStudentFormDefaults,
  REQUIRED_FIELD_NAMES,
  STUDENT_FORM_SECTIONS,
} from "@/lib/studentForm/studentFormConfig";
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
      <ScrollArea
        className="h-[360px] pr-4"
        role="region"
        aria-label="Campos do formulário de aluno"
      >
        <div className="flex flex-col gap-6 pb-2">
          {STUDENT_FORM_SECTIONS.map((section, sectionIndex) => (
            <div key={section.title} className="flex flex-col gap-6">
              {sectionIndex > 0 ? <FieldSeparator /> : null}
              <FieldSet>
                <FieldLegend>{section.title}</FieldLegend>
                {section.description ? (
                  <FieldDescription>{section.description}</FieldDescription>
                ) : null}
                <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {section.fields.map((field) => {
                    const fieldError = errors[field.name];
                    const fieldId = `student-${field.name}`;
                    const descriptionId = field.description
                      ? `${fieldId}-description`
                      : undefined;
                    const errorId = fieldError ? `${fieldId}-error` : undefined;
                    const describedBy =
                      [descriptionId, errorId].filter(Boolean).join(" ") ||
                      undefined;
                    const isRequired = REQUIRED_FIELD_NAMES.has(field.name);

                    return (
                      <Field
                        key={field.name}
                        data-invalid={fieldError ? true : undefined}
                        className={
                          field.multiline ? "md:col-span-2" : undefined
                        }
                      >
                        <FieldLabel htmlFor={fieldId}>
                          {field.label}
                          {isRequired ? (
                            <span
                              aria-hidden="true"
                              className="text-destructive"
                            >
                              *
                            </span>
                          ) : null}
                        </FieldLabel>
                        {field.multiline ? (
                          <Textarea
                            id={fieldId}
                            rows={3}
                            aria-invalid={fieldError ? true : undefined}
                            aria-required={isRequired ? true : undefined}
                            aria-describedby={describedBy}
                            placeholder={field.placeholder}
                            {...register(field.name)}
                          />
                        ) : (
                          <Input
                            id={fieldId}
                            aria-invalid={fieldError ? true : undefined}
                            aria-required={isRequired ? true : undefined}
                            aria-describedby={describedBy}
                            placeholder={field.placeholder}
                            {...register(field.name)}
                          />
                        )}
                        {field.description ? (
                          <FieldDescription id={descriptionId}>
                            {field.description}
                          </FieldDescription>
                        ) : null}
                        <FieldError
                          id={errorId}
                          errors={fieldError ? [fieldError] : undefined}
                        />
                      </Field>
                    );
                  })}
                </FieldGroup>
              </FieldSet>
            </div>
          ))}
        </div>
      </ScrollArea>

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
