import * as XLSX from "xlsx";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";
import type { ParseSpreadsheetResult } from "@/types/parseSpreadsheetResult";

const FIELD_ALIASES: Record<keyof SpreadsheetStudentType, string[]> = {
  qual_a_sua_idade: ["Qual a sua idade?"],
  escolha_o_turno: ["Escolha o Turno"],
  dia_semana_prep1: ["Dia da semana para as aulas (Curso Preparatório I) "],
  escolha_o_turno_2: ["Escolha o Turno 2"],
  dia_semana_prep2: ["Dia da semana para a aula Curso Preparatório II"],
  cursos_disponiveis: ["curso", "Cursos disponíveis "],
  dia_semana_regular: ["Dia da semana para as aulas (Cursos Regulares)"],
  curso_noturno: ["Cursos disponíveis noturno"],
  dia_semana_regular_2: ["Dia da semana para as aulas (Cursos Regulares) 2"],
  horario: ["Horário"],
  nome_completo: ["nome", "Nome completo "],
  idade: ["idade", "Idade "],
  data_nascimento: ["Data de nascimento "],
  pcd: ["O(a) candidato(a) é pessoa com deficiência (PCD)?  "],
  tipo_deficiencia: ["Caso afirmativo, informe o tipo de deficiência "],
  laudo_medico: ["Caso afirmativo, anexe laudo médico "],
  telefone_para_contato: ["telefone", "Telefone para contato"],
  nome_pai: ["Nome completo do pai  "],
  nome_mae_ou_responsavel: [
    "pais/responsavel",
    "pais responsavel",
    "responsavel",
    "Nome completo da mãe (ou responsável) ",
  ],
  telefone_responsavel: ["Telefone do responsável  "],
  outros_contatos: ["Outros contatos (se houver)"],
  foto_3x4: ["Foto 3x4"],
  documento_aluno: [
    "1. Documento de identificação do aluno  (Certidão de Nascimento ou RG) (Enviar um único arquivo unico PDF, Word ou FOTO)\t",
  ],
  documento_responsavel: [
    "1. Documento de identificação do pai, mãe ou responsável legal ( RG e CPF) (Enviar um único arquivo unico PDF, Word ou FOTO)\t ",
  ],
  comprovante_endereco: [
    "Comprovante de endereço atualizado (Conta de água, energia, telefone, internet, emitido nos últimos 90 dias) (Enviar um único arquivo unico PDF, Word ou FOTO)\t",
  ],
  informacoes_saude: [
    "observacoes medicas",
    "observações medicas",
    "Informações pertinentes à saúde do(a) aluno(a)   (Alergias, TDAH, condições médicas relevantes, uso contínuo de medicação, entre outros) Tipo: Parágrafo Observação: As informações serão utilizadas exclusivamente para fins de acompanhamento e segurança do aluno, em conformidade com a legislação vigente.",
  ],
  autorizacao_uso_imagem: [
    "Autorizo, de forma gratuita, a Secretaria Municipal de Cultura e Turismo da Prefeitura Municipal de Anápolis a utilizar a imagem, captadas durante atividades pedagógicas, eventos, apresentações, exposições e ações institucionais da Escola de Artes de Anápolis Oswaldo Verano, para fins exclusivamente educativos, culturais e institucionais, incluindo divulgação em materiais impressos, audiovisuais, site oficial e redes sociais institucionais, sem qualquer ônus ou prazo determinado.\t",
  ],
  declaracao_ciente: [
    "Declaro que li e estou ciente das condições estabelecidas pela Secretaria Municipal de Cultura e Turismo da Prefeitura Municipal de Anápolis para participação na Escola de Artes de Anápolis Oswaldo Verano, responsabilizando-me pela veracidade das informações prestadas.",
  ],
};

const REQUIRED_COLUMNS = [
  "nome_completo",
  "idade",
  "data_nascimento",
  "telefone_para_contato",
  "telefone_responsavel",
  "documento_aluno",
  "documento_responsavel",
  "comprovante_endereco",
] satisfies (keyof SpreadsheetStudentType)[];

export function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "_")
    .replaceAll(/^_+|_+$/g, "");
}

function toText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }

  return "";
}

function readField(
  row: Record<string, string>,
  field: keyof SpreadsheetStudentType,
) {
  for (const alias of FIELD_ALIASES[field]) {
    const normalizedAlias = normalizeKey(alias);
    const candidate = row[normalizedAlias];

    if (candidate) {
      return candidate;
    }
  }
  return "";
}

function validateRequiredColumns(normalizeHeaderKeys: string[]) {
  const headerSet = new Set(normalizeHeaderKeys); // lista de cabeçalho da planilha carregada

  const missingColumns = REQUIRED_COLUMNS.filter((field) => {
    // buscando o nome da coluna obrigatória dentro do objeto que reune os cabeçalhos de interesse e como eles podem estar aparecendo na lista de cabeçalho da planilha carregada - FIELD_ALIASES
    const hasAlias = FIELD_ALIASES[field].some((alias) =>
      headerSet.has(normalizeKey(alias)),
    );
    return !hasAlias;
  });

  return {
    isValid: missingColumns.length === 0,
    missingColumns,
  };
}

export async function parseSpreadsheetFile(
  file: File,
): Promise<ParseSpreadsheetResult> {
  const workbook = XLSX.read(await file.arrayBuffer(), {
    type: "array",
    raw: true,
  });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return {
      success: false,
      message: [
        "Não foi possível ler os dados da planilha. Verifique se o arquivo possui uma aba com dados e se os dados dos alunos estão na primeira aba da planilha",
      ],
    };
  }

  const sheet = workbook.Sheets[sheetName];

  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  if (!rawRows[0]) {
    return {
      success: false,
      message: [
        "Não foi possível ler os dados da planilha. Verifique se o arquivo possui uma aba com dados e se os dados dos alunos estão na primeira aba da planilha",
      ],
    };
  }

  const headerKeys = Object.keys(rawRows[0] ?? {}).map((key) =>
    normalizeKey(key),
  );

  const headerValidation = validateRequiredColumns(headerKeys);

  if (!headerValidation.isValid) {
    return {
      success: false,
      message: headerValidation.missingColumns,
    };
  }

  const rows = rawRows
    .map((row) => {
      const normalizedRow: Record<string, string> = {};

      for (const [key, value] of Object.entries(row)) {
        normalizedRow[normalizeKey(key)] = toText(value);
      }

      return {
        qual_a_sua_idade: readField(normalizedRow, "qual_a_sua_idade"),
        escolha_o_turno: readField(normalizedRow, "escolha_o_turno"),
        dia_semana_prep1: readField(normalizedRow, "dia_semana_prep1"),
        escolha_o_turno_2: readField(normalizedRow, "escolha_o_turno_2"),
        dia_semana_prep2: readField(normalizedRow, "dia_semana_prep2"),
        cursos_disponiveis: readField(normalizedRow, "cursos_disponiveis"),
        dia_semana_regular: readField(normalizedRow, "dia_semana_regular"),
        curso_noturno: readField(normalizedRow, "curso_noturno"),
        dia_semana_regular_2: readField(normalizedRow, "dia_semana_regular_2"),
        horario: readField(normalizedRow, "horario"),
        nome_completo: normalizeKey(readField(normalizedRow, "nome_completo")),
        idade: readField(normalizedRow, "idade"),
        data_nascimento: readField(normalizedRow, "data_nascimento"),
        pcd: readField(normalizedRow, "pcd"),
        tipo_deficiencia: readField(normalizedRow, "tipo_deficiencia"),
        laudo_medico: readField(normalizedRow, "laudo_medico"),
        telefone_para_contato: readField(
          normalizedRow,
          "telefone_para_contato",
        ),
        nome_pai: readField(normalizedRow, "nome_pai"),
        nome_mae_ou_responsavel: readField(
          normalizedRow,
          "nome_mae_ou_responsavel",
        ),
        telefone_responsavel: readField(normalizedRow, "telefone_responsavel"),
        outros_contatos: readField(normalizedRow, "outros_contatos"),
        foto_3x4: readField(normalizedRow, "foto_3x4"),
        documento_aluno: readField(normalizedRow, "documento_aluno"),
        documento_responsavel: readField(
          normalizedRow,
          "documento_responsavel",
        ),
        comprovante_endereco: readField(normalizedRow, "comprovante_endereco"),
        informacoes_saude: readField(normalizedRow, "informacoes_saude"),
        autorizacao_uso_imagem: readField(
          normalizedRow,
          "autorizacao_uso_imagem",
        ),
        declaracao_ciente: readField(normalizedRow, "declaracao_ciente"),
      };
    })
    .filter((row) => Object.values(row).some(Boolean));

  return { success: true, message: rows };
}
