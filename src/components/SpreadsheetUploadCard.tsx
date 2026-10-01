import { useId, type ChangeEvent } from "react";
import { ChevronsUpDown, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types/component.types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface SpreadsheetUploadCardProps {
  selectedFileName?: string | null;
  isParsing?: boolean;
  statusMessage?: string;
  statusTone?: StatusTone;
  lastUploadLabel?: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  isOpen,
  setIsOpen
}: SpreadsheetUploadCardProps) {
  const inputId = useId();
  const hintId = useId();
  const statusId = useId();
 
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between">
        <div className="flex flex-row w-full justify-between items-center">
          <h2 id="upload-heading" className="font-semibold leading-none tracking-tight">Carregar Planilha</h2>
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
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="flex justify-between items-center p-2">
        <div>
          <p className="text-sm text-muted-foreground">Selecione a planilha com os dados dos alunos.</p>
          <p id={hintId} className="text-sm text-muted-foreground">
            Formatos aceitos: .xlsx, .ods, .csv
          </p>
        </div>
        <div
          id={statusId}
          role="status"
          className="flex flex-col gap-1"
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
      </CollapsibleContent>
    </Collapsible>
  );
}
