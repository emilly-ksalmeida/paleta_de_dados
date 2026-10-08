# Manual de Instruções — Formato da Planilha Padrão

Este documento descreve o formato esperado pela aplicação para o arquivo de planilha enviado no upload, com base na implementação de `src/lib/spreadsheet/spreadsheet.ts`.

## 1. Arquivo e aba

- O arquivo deve ser uma planilha legível pelo motor `xlsx` (`.xlsx`, `.xls`, `.csv`).
- Os dados dos alunos devem estar na **primeira aba** da planilha. Se a primeira aba estiver vazia ou ausente, a aplicação retorna o erro: *"Não foi possível ler os dados da planilha..."*.
- A **primeira linha** da aba é tratada como cabeçalho. Cada célula dessa linha vira o nome da coluna usada no pareamento de campos.
- Linhas em que todos os campos estejam vazias são descartadas e não contam como registro.

## 2. Como os cabeçalhos são reconhecidos

Antes de comparar os cabeçalhos, o texto passa por uma normalização (`normalizeKey`):

1. acentos são removidos (`ç` → `c`, `á` → `a`, ...);
2. o texto é convertido para minúsculas;
3. qualquer caractere que não seja letra ou número vira `_`;
4. underscores no início e no fim são removidos.

Exemplos: `"Nome completo "` → `nome_completo`, `"Telefone para contato"` → `telefone_para_contato`, `"Idade "` → `idade`.

Isso significa que diferenças de caixa, acentuação, espaços extras ou pontuação nos cabeçalhos **não** impedem o reconhecimento. Além disso, cada campo aceita mais de um apelido de cabeçalho (ver seção 3), então cabeçalhos como `"nome"` ou `"telefone"` também funcionam nos campos indicados.

> Atenção: as comparações acima são *independentes de acento/caixa*, mas um cabeçalho diferente dos apelidos conhecidos simplesmente não será mapeado (o campo sai vazio naquele registro).

## 3. Cabeçalhos aceitos por campo

Tabela completa de campos e dos cabeçalhos aceitos para cada um (qualquer um dos apelidos basta):

| Campo interno | Cabeçalhos aceitos (apelidos) |
|---|---|
| `nome_completo` | `nome`, `Nome completo ` |
| `idade` | `idade`, `Idade ` |
| `data_nascimento` | `Data de nascimento ` |
| `telefone_para_contato` | `telefone`, `Telefone para contato` |
| `nome_pai` | `Nome completo do pai  ` |
| `nome_mae_ou_responsavel` | `pais/responsavel`, `pais responsavel`, `responsavel`, `Nome completo da mãe (ou responsável) ` |
| `telefone_responsavel` | `Telefone do responsável  ` |
| `outros_contatos` | `Outros contatos (se houver)` |
| `pcd` | `O(a) candidato(a) é pessoa com deficiência (PCD)?  ` |
| `tipo_deficiencia` | `Caso afirmativo, informe o tipo de deficiência ` |
| `laudo_medico` | `Caso afirmativo, anexe laudo médico ` |
| `foto_3x4` | `Foto 3x4` |
| `documento_aluno` | `1. Documento de identificação do aluno  (Certidão de Nascimento ou RG) (Enviar um único arquivo unico PDF, Word ou FOTO)` |
| `documento_responsavel` | `1. Documento de identificação do pai, mãe ou responsável legal ( RG e CPF) (Enviar um único arquivo unico PDF, Word ou FOTO)` |
| `comprovante_endereco` | `Comprovante de endereço atualizado (Conta de água, energia, telefone, internet, emitido nos últimos 90 dias) (Enviar um único arquivo unico PDF, Word ou FOTO)` |
| `informacoes_saude` | `observacoes medicas`, `observações medicas`, `Informações pertinentes à saúde do(a) aluno(a) ...` |
| `autorizacao_uso_imagem` | texto completo da autorização de uso de imagem |
| `declaracao_ciente` | texto completo da declaração de ciência das condições |
| `qual_a_sua_idade` | `Qual a sua idade?` |
| `escolha_o_turno` | `Escolha o Turno` |
| `dia_semana_prep1` | `Dia da semana para as aulas (Curso Preparatório I) ` |
| `escolha_o_turno_2` | `Escolha o Turno 2` |
| `dia_semana_prep2` | `Dia da semana para a aula Curso Preparatório II` |
| `cursos_disponiveis` | `curso`, `Cursos disponíveis ` |
| `dia_semana_regular` | `Dia da semana para as aulas (Cursos Regulares)` |
| `curso_noturno` | `Cursos disponíveis noturno` |
| `dia_semana_regular_2` | `Dia da semana para as aulas (Cursos Regulares) 2` |
| `horario` | `Horário` |

## 4. Colunas obrigatórias

Para que a aplicação aceite a planilha, a primeira aba **precisa conter** cabeçalhos correspondentes a todos os campos abaixo. Se algum faltar, o upload é recusado e a interface exibe: `Coluna(s) obrigatória(s) ausente(s): <campo>, <campo>.`

| # | Campo obrigatório | Um destes cabeçalhos basta |
|---|---|---|
| 1 | `nome_completo` | `nome` ou `Nome completo ` |
| 2 | `idade` | `idade` ou `Idade ` |
| 3 | `data_nascimento` | `Data de nascimento ` |
| 4 | `telefone_para_contato` | `telefone` ou `Telefone para contato` |
| 5 | `telefone_responsavel` | `Telefone do responsável  ` |
| 6 | `documento_aluno` | cabeçalho do documento de identificação do aluno |
| 7 | `documento_responsavel` | cabeçalho do documento de identificação do responsável |
| 8 | `comprovante_endereco` | cabeçalho do comprovante de endereço |

Os demais campos da seção 3 são **opcionais**: se a coluna não existir, o campo é preenchido com valor vazio nos registros.

## 5. Formato dos valores nas células

- **Texto**: valores de texto são aparados (espaços nas extremidades removidos).
- **Datas** (`data_nascimento`): se a célula contiver apenas dígitos com 8 posições, é interpretada como `ddMMaaaa` (ex.: `15031990` → `15/03/1990`); com 6 posições, como `ddMMaa` (ex.: `150390` → `15/03/1990`). Datas que não forem válidas ficam como texto original.
- **Números**: valores numéricos são convertidos para texto (ex.: `12` → `"12"`). Células vazias ou nulas viram string vazia.
- **Linha vazia**: registros em que todos os campos parseados estejam vazios são ignorados.

## 6. Checklist rápido antes do upload

1. O arquivo está na primeira aba com os dados dos alunos?
2. A primeira linha contém os cabeçalhos (títulos) das colunas?
3. As 8 colunas obrigatórias da seção 4 estão presentes (ao menos um apelido de cada)?
4. As datas de nascimento estão como `ddmmaaaa`/`ddmmaa` só com dígitos, ou já formatadas?
5. há ao menos uma linha de dados abaixo do cabeçalho?
