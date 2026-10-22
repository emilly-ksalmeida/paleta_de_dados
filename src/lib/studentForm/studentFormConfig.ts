import { formatBirthDate } from "@/lib/format/birthDate";
import { formatDisplayName } from "@/lib/format/displayName";
import type { StudentFormValues } from "@/schemas/studentFormSchema";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

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

export const STUDENT_FORM_SECTIONS: StudentFormSection[] = [
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

export function getStudentFormDefaults(
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

export const REQUIRED_FIELD_NAMES = new Set<keyof StudentFormValues>([
  "nome_completo",
  "idade",
  "data_nascimento",
  "telefone_para_contato",
  "telefone_responsavel",
  "documento_aluno",
  "documento_responsavel",
  "comprovante_endereco",
]);
