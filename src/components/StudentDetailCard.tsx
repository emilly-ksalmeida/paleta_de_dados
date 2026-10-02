import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/InfoRow";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

interface StudentDetailCardProps {
  selectedStudent: SpreadsheetStudentType | null;
}

export function StudentDetailCard({
  selectedStudent
}: StudentDetailCardProps) {
  const photoUrl = selectedStudent?.foto_3x4?.trim() ?? "";

  return (
    <Card className="mx-auto max-w-[800px] overflow-hidden">
      <div className="border-b border-border bg-success-light px-6 py-4">
        <h2
          id="dados-heading"
          className="text-xs font-bold uppercase tracking-widest text-success"
        >
          Informações do aluno
        </h2>
        {selectedStudent ? (
          <p className="mt-0.5 text-lg font-bold text-foreground">
            {selectedStudent.nome_completo}
          </p>
        ) : (
          <p className="mt-0.5 text-lg font-semibold text-muted-foreground">
            Nenhum aluno selecionado
          </p>
        )}
      </div>
      <div className="px-6 py-5">
        {!selectedStudent ? (
          <div className="rounded-lg border border-muted bg-muted/50 p-4 text-sm text-muted-foreground">
            Selecione um aluno nos resultados para ver seus dados principais.
          </div>
        ) : (
          <>
            <dl className="space-y-3.5">
              <InfoRow
                label="Telefone"
                value={selectedStudent.telefone_para_contato.trim()}
              />
              <InfoRow
                label="Responsável"
                value={selectedStudent.nome_mae_ou_responsavel.trim()}
              />
              <InfoRow
                label="Telefone do responsável"
                value={selectedStudent.telefone_responsavel.trim()}
              />
              <InfoRow
                label="Curso"
                value={(selectedStudent.cursos_disponiveis ?? "").trim()}
              />
              <InfoRow
                label="Informações médicas"
                value={(selectedStudent.informacoes_saude ?? "").trim()}
              />
            </dl>
            <div className="mt-5 flex gap-2 border-t border-border pt-4">
              {photoUrl ? (
                <Button asChild variant="outline" className="flex-1">
                  <a
                    href={photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visualizar foto
                  </a>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled
                >
                  Visualizar foto
                </Button>
              )}
              {/* <Button
                type="button"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hover"
                onClick={onEdit}
              >
                Editar
              </Button> */}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
