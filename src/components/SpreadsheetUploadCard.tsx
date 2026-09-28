import { useId, type ChangeEvent } from "react";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types/component.types";

interface SpreadsheetUploadCardProps {
  selectedFileName?: string | null;
  isParsing?: boolean;
  statusMessage?: string;
  statusTone?: StatusTone;
  lastUploadLabel?: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const statusToneStyles: Record<StatusTone, string> = {
  default: "text-muted-foreground",
  success: "border-success bg-success-light text-success",
  warning: "border-warning bg-warning-light text-warning",
  error: "border-destructive bg-destructive-light text-destructive",
};

export function SpreadsheetUploadCard({
  selectedFileName = null,
  isParsing = false,
  statusMessage,
  statusTone = "default",
  lastUploadLabel,
  onFileChange,
}: SpreadsheetUploadCardProps) {
  const inputId = useId();
  const hintId = useId();
  const statusId = useId();

  return (
    <Card className="flex justify-between p-2">
      <CardHeader>
        <CardTitle asChild>
          <h2 id="upload-heading">Carregar Planilha</h2>
        </CardTitle>
        <CardDescription>
          Selecione a planilha com os dados dos alunos.
          <p id={hintId} className="text-sm text-muted-foreground">
            Formatos aceitos: .xlsx, .ods, .csv
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-end gap-3">
        <Input
          id={inputId}
          type="file"
          accept=".xlsx,.ods,.csv"
          className="sr-only"
          disabled={isParsing}
          aria-describedby={`${hintId} ${statusId}`}
          onChange={onFileChange}
        />
        {isParsing ? (
          <Button
            type="button"
            disabled
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            <Loader2 className="animate-spin" aria-hidden="true" />
            Carregando planilha...
          </Button>
        ) : (
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            <label htmlFor={inputId} className="font-bold">
              <Upload aria-hidden="true" />
              Escolher planilha
            </label>
          </Button>
        )}
        <div
          id={statusId}
          role="status"
          className="flex flex-col items-end gap-1"
        >
          {selectedFileName ? (
            <p className="text-sm font-medium text-foreground">
              Arquivo selecionado: {selectedFileName}
            </p>
          ) : null}
          {statusMessage ? (
            <p
              className={cn(
                "max-w-sm rounded-md border px-3 py-2 text-sm",
                statusToneStyles[statusTone],
              )}
            >
              {statusMessage}
            </p>
          ) : null}
          {lastUploadLabel ? (
            <p className="text-sm text-muted-foreground">
              Último upload: {lastUploadLabel}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
