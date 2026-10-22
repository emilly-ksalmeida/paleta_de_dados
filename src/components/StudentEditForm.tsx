import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

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
import { formatBirthDate } from "@/lib/format/birthDate";
import { formatDisplayName } from "@/lib/format/displayName";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

function requiredText(message: string) {
  return z.string().trim().min(1, message);
}

function isValidBirthDateInput(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (!match) {
    return false;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (year < 1900 || year > 2099) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const studentFormSchema = z.object({
  qual_a_sua_idade: z.string(),
  escolha_o_turno: z.string(),
  dia_semana_prep1: z.string(),
  escolha_o_turno_2: z.string(),
  dia_semana_prep2: z.string(),
  cursos_disponiveis: z.string(),
  dia_semana_regular: z.string(),
  curso_noturno: z.string(),
  dia_semana_regular_2: z.string(),
  horario: z.string(),
  nome_completo: requiredText("Informe o nome completo."),
  idade: requiredText("Informe a idade."),
  data_nascimento: requiredText("Informe a data de nascimento.").refine(
    isValidBirthDateInput,
    "Use uma data válida no formato dd/mm/aaaa.",
  ),
  pcd: z.string(),
  tipo_deficiencia: z.string(),
  laudo_medico: z.string(),
  telefone_para_contato: requiredText("Informe o telefone para contato."),
  nome_pai: z.string(),
  nome_mae_ou_responsavel: z.string(),
  telefone_responsavel: requiredText("Informe o telefone do responsável."),
  outros_contatos: z.string(),
  foto_3x4: z.string(),
  documento_aluno: requiredText("Informe o documento do aluno."),
  documento_responsavel: requiredText("Informe o documento do responsável."),
  comprovante_endereco: requiredText("Informe o comprovante de endereço."),
  informacoes_saude: z.string(),
  autorizacao_uso_imagem: z.string(),
  declaracao_ciente: z.string(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

type StudentFieldName = keyof StudentFormValues;

interface StudentFieldConfig {
  name: StudentFieldName;
  label: string;
  description?: string;
  placeholder?: string;
  multiline?: boolean;
}

interface StudentFormSection {
  title: string;
  description?: string;
  fields: StudentFieldConfig[];
}

const STUDENT_FORM_SECTIONS: StudentFormSection[] = [
  {
    title: "Dados pessoais",
    fields: [
      { name: "nome_completo", label: "Nome completo" },
      { name: "idade", label: "Idade" },
      {
        name: "data_nascimento",
        label: "Data de nascimento",
        description: "Use o formato dd/mm/aaaa.",
        placeholder: "dd/mm/aaaa",
      },
      { name: "qual_a_sua_idade", label: "Qual a sua idade?" },
      { name: "pcd", label: "Pessoa com deficiência (PCD)?" },
      { name: "tipo_deficiencia", label: "Tipo de deficiência" },
    ],
  },
  {
    title: "Contato",
    fields: [
      {
        name: "telefone_para_contato",
        label: "Telefone para contato",
      },
      { name: "nome_pai", label: "Nome do pai" },
      {
        name: "nome_mae_ou_responsavel",
        label: "Nome da mãe ou responsável",
      },
      {
        name: "telefone_responsavel",
        label: "Telefone do responsável",
      },
      {
        name: "outros_contatos",
        label: "Outros contatos",
        description: "Separe os contatos conforme estiverem na planilha.",
        multiline: true,
      },
    ],
  },
  {
    title: "Documentos e anexos",
    description: "Informe os links ou referências.",
    fields: [
      {
        name: "documento_aluno",
        label: "Documento do aluno",
        multiline: true,
      },
      {
        name: "documento_responsavel",
        label: "Documento do responsável",
        multiline: true,
      },
      {
        name: "comprovante_endereco",
        label: "Comprovante de endereço",
        multiline: true,
      },
      { name: "foto_3x4", label: "Foto 3x4" },
      { name: "laudo_medico", label: "Laudo médico" },
    ],
  },
  {
    title: "Saúde",
    fields: [
      {
        name: "informacoes_saude",
        label: "Informações de saúde",
        multiline: true,
      },
    ],
  },
  {
    title: "Curso e turma",
    description:
      "Preencha somente os campos correspondentes à matrícula do aluno. Os demais podem ficar vazios.",
    fields: [
      { name: "escolha_o_turno", label: "Escolha o turno" },
      {
        name: "dia_semana_prep1",
        label: "Dia da semana - Curso Preparatório I",
      },
      { name: "escolha_o_turno_2", label: "Escolha o turno 2" },
      {
        name: "dia_semana_prep2",
        label: "Dia da semana - Curso Preparatório II",
      },
      { name: "cursos_disponiveis", label: "Cursos disponíveis" },
      {
        name: "dia_semana_regular",
        label: "Dia da semana - Cursos Regulares",
      },
      { name: "curso_noturno", label: "Cursos disponíveis noturno" },
      {
        name: "dia_semana_regular_2",
        label: "Dia da semana - Cursos Regulares 2",
      },
      { name: "horario", label: "Horário" },
    ],
  },
  {
    title: "Autorizações",
    fields: [
      {
        name: "autorizacao_uso_imagem",
        label: "Autorização de uso de imagem",
        multiline: true,
      },
      {
        name: "declaracao_ciente",
        label: "Declaração de ciência",
        multiline: true,
      },
    ],
  },
];

function getStudentFormDefaults(
  student: SpreadsheetStudentType,
): StudentFormValues {
  const formattedBirthDate = formatBirthDate(student.data_nascimento);

  return {
    qual_a_sua_idade: student.qual_a_sua_idade ?? "",
    escolha_o_turno: student.escolha_o_turno ?? "",
    dia_semana_prep1: student.dia_semana_prep1 ?? "",
    escolha_o_turno_2: student.escolha_o_turno_2 ?? "",
    dia_semana_prep2: student.dia_semana_prep2 ?? "",
    cursos_disponiveis: student.cursos_disponiveis ?? "",
    dia_semana_regular: student.dia_semana_regular ?? "",
    curso_noturno: student.curso_noturno ?? "",
    dia_semana_regular_2: student.dia_semana_regular_2 ?? "",
    horario: student.horario ?? "",
    nome_completo: formatDisplayName(student.nome_completo),
    idade: student.idade,
    data_nascimento:
      formattedBirthDate === "Não informado" ? "" : formattedBirthDate,
    pcd: student.pcd,
    tipo_deficiencia: student.tipo_deficiencia ?? "",
    laudo_medico: student.laudo_medico ?? "",
    telefone_para_contato: student.telefone_para_contato,
    nome_pai: student.nome_pai ?? "",
    nome_mae_ou_responsavel: student.nome_mae_ou_responsavel,
    telefone_responsavel: student.telefone_responsavel,
    outros_contatos: student.outros_contatos ?? "",
    foto_3x4: student.foto_3x4 ?? "",
    documento_aluno: student.documento_aluno,
    documento_responsavel: student.documento_responsavel ?? "",
    comprovante_endereco: student.comprovante_endereco,
    informacoes_saude: student.informacoes_saude ?? "",
    autorizacao_uso_imagem: student.autorizacao_uso_imagem,
    declaracao_ciente: student.declaracao_ciente,
  };
}

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
