import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { StudentFormFields } from "@/components/StudentFormFields";
import { Button } from "@/components/ui/button";
import { getEmptyStudentFormDefaults } from "@/lib/studentForm/studentFormConfig";
import {
  studentFormSchema,
  type StudentFormValues,
} from "@/schemas/studentFormSchema";

interface StudentCreateFormProps {
  onSubmit: (values: StudentFormValues) => Promise<boolean>;
}

export function StudentCreateForm({ onSubmit }: StudentCreateFormProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    mode: "onSubmit",
    defaultValues: getEmptyStudentFormDefaults(),
  });

  const submit: SubmitHandler<StudentFormValues> = async (data) => {
    const didCreate = await onSubmit(data);

    if (didCreate) {
      reset();
    }
  };

  return (
    <form
      className="flex flex-col"
      aria-label="Formulário de cadastro de aluno"
      aria-busy={isSubmitting}
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
        idPrefix="student-create"
      />

      <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Limpar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : null}
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}
