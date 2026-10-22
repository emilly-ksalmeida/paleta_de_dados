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
import {
  getStudentFormDefaults,
  STUDENT_FORM_SECTIONS,
} from "@/lib/studentForm/studentFormConfig";
import {
  studentFormSchema,
  type StudentFormValues,
} from "@/schemas/studentFormSchema";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

interface StudentEditFormProps {
  selectedStudent: SpreadsheetStudentType;
  onCancel: () => void;
}

export function StudentEditForm({
  selectedStudent,
  onCancel,
}: StudentEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    mode: "onSubmit",
    defaultValues: getStudentFormDefaults(selectedStudent),
  });

  const submit: SubmitHandler<StudentFormValues> = (data) => {
    const updatedStudent: SpreadsheetStudentType = {
      ...selectedStudent,
      ...data,
    };

    // TODO: persistir no Dexie (db.students.update ou função updateStudent).
    void updatedStudent;
  };

  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        void handleSubmit(submit)(event);
      }}
    >
      <ScrollArea className="h-[360px] pr-4">
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

                    return (
                      <Field
                        key={field.name}
                        data-invalid={fieldError ? true : undefined}
                        className={
                          field.multiline ? "md:col-span-2" : undefined
                        }
                      >
                        <FieldLabel htmlFor={fieldId}>{field.label}</FieldLabel>
                        {field.multiline ? (
                          <Textarea
                            id={fieldId}
                            rows={3}
                            aria-invalid={fieldError ? true : undefined}
                            placeholder={field.placeholder}
                            {...register(field.name)}
                          />
                        ) : (
                          <Input
                            id={fieldId}
                            aria-invalid={fieldError ? true : undefined}
                            placeholder={field.placeholder}
                            {...register(field.name)}
                          />
                        )}
                        {field.description ? (
                          <FieldDescription>
                            {field.description}
                          </FieldDescription>
                        ) : null}
                        <FieldError
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
