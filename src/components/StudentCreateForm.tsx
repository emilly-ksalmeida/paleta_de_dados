import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { StudentFormFields } from "@/components/StudentFormFields";
import { Button } from "@/components/ui/button";
import { getEmptyStudentFormDefaults } from "@/lib/studentForm/studentFormConfig";
import {
  studentFormSchema,
  type StudentFormValues,
} from "@/schemas/studentFormSchema";

export function StudentCreateForm() {
  const {
    register,
    reset,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    mode: "onSubmit",
    defaultValues: getEmptyStudentFormDefaults(),
  });

  return (
    <form
      className="flex flex-col"
      aria-label="Formulário de cadastro de aluno"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <p aria-hidden="true" className="mb-2 text-sm text-muted-foreground">
        Campos com <span className="text-destructive">*</span> são obrigatórios.
      </p>

      <StudentFormFields
        register={register}
        errors={errors}
        idPrefix="student-create"
      />

      <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Limpar
        </Button>
        <Button
          type="submit"
          disabled
          title="Disponível após a integração com o banco de dados."
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          Cadastrar
        </Button>
      </div>
    </form>
  );
}
