export interface RadioOption {
  value: string;
  label: string;
}

export const AUTORIZACAO_USO_IMAGEM_TEXT =
  "Autorizo, de forma gratuita, a Secretaria Municipal de Cultura e Turismo da Prefeitura Municipal de Anápolis a utilizar a imagem, captadas durante atividades pedagógicas, eventos, apresentações, exposições e ações institucionais da Escola de Artes de Anápolis Oswaldo Verano, para fins exclusivamente educativos, culturais e institucionais, incluindo divulgação em materiais impressos, audiovisuais, site oficial e redes sociais institucionais, sem qualquer ônus ou prazo determinado.";

export const DECLARACAO_CIENTE_TEXT =
  "Declaro que li e estou ciente das condições estabelecidas pela Secretaria Municipal de Cultura e Turismo da Prefeitura Municipal de Anápolis para participação na Escola de Artes de Anápolis Oswaldo Verano, responsabilizando-me pela veracidade das informações prestadas.";

export const AUTORIZACAO_USO_IMAGEM_SIM =
  "Sim, autorizo o uso de imagem conforme descrito acima";

export const AUTORIZACAO_USO_IMAGEM_NAO = "Não autorizo";

export const DECLARACAO_CIENTE_VALUE = "Declaro ciência e concordância";

export const AUTORIZACAO_USO_IMAGEM_OPTIONS: RadioOption[] = [
  {
    value: AUTORIZACAO_USO_IMAGEM_SIM,
    label: AUTORIZACAO_USO_IMAGEM_SIM,
  },
  {
    value: AUTORIZACAO_USO_IMAGEM_NAO,
    label: AUTORIZACAO_USO_IMAGEM_NAO,
  },
];

export const DECLARACAO_CIENTE_OPTIONS: RadioOption[] = [
  {
    value: DECLARACAO_CIENTE_VALUE,
    label: DECLARACAO_CIENTE_VALUE,
  },
];
