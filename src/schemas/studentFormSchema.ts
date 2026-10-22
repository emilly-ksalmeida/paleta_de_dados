import { z } from "zod";

import { isValidBirthDateInput } from "@/lib/validation/isValidBirthDateInput";
import { requiredText } from "@/lib/validation/requiredText";

export const studentFormSchema = z.object({
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

export type StudentFormValues = z.infer<typeof studentFormSchema>;
