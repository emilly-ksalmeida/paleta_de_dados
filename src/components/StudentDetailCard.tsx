import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/InfoRow";
import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

interface StudentDetailCardProps {
  student: SpreadsheetStudentType | null;
  onViewPhoto?: () => void;
  onEdit?: () => void;
}

export function StudentDetailCard({
  student,
  onViewPhoto,
  onEdit,
}: StudentDetailCardProps) {
  return (
    <Card className="overflow-hidden max-w-[800px] mx-auto">
      <div className="border-b border-border bg-success-light px-6 py-4">
        <h2
          id="dados-heading"
          className="text-xs font-bold uppercase tracking-widest text-success"
        >
          Informações do aluno
        </h2>
        {student ? (
          <p className="mt-0.5 text-lg font-bold text-foreground">
            {student.nome_completo}
          </p>
        ) : (
          <p className="mt-0.5 text-lg font-semibold text-muted-foreground">
            Nenhum aluno selecionado
          </p>
        )}
      </div>
      <div className="px-6 py-5">
        {!student ? (
          <div className="rounded-lg border border-muted bg-muted/50 p-4 text-sm text-muted-foreground">
            Selecione um aluno nos resultados para ver seus dados principais.
          </div>
        ) : (
          <>
            <dl className="space-y-3.5">
              <InfoRow
                label="Telefone"
                value={student.telefone_para_contato.trim()}
              />
              <InfoRow
                label="Responsável"
                value={student.nome_mae_ou_responsavel.trim()}
              />
              <InfoRow
                label="Telefone do responsável"
                value={student.telefone_responsavel.trim()}
              />
              <InfoRow
                label="Curso"
                value={(student.cursos_disponiveis ?? "").trim()}
              />
              <InfoRow
                label="Informações médicas"
                value={(student.informacoes_saude ?? "").trim()}
              />
            </dl>
            <div className="mt-5 flex gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onViewPhoto}
              >
                Visualizar foto
              </Button>
              <Button
                type="button"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hover"
                onClick={onEdit}
              >
                Editar
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
