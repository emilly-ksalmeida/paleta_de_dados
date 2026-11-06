import { useId, type ChangeEvent } from "react";

import { ChevronsUpDown, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StatusTone } from "@/types/component.types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import FeedbackMessage from "./FeedbackMessage";
import ExportButton from "./ExportButton";
import UploadButton from "./UploadButton";

interface SpreadsheetUploadCardProps {
  selectedFileName?: string | null;
  isParsing?: boolean;
  statusMessage?: string;
  statusTone?: StatusTone;
  lastUploadLabel?: string;
  hasUnexportedChanges?: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SpreadsheetUploadCard({
  selectedFileName = null,
  isParsing = false,
  statusMessage,
  statusTone = "default",
  lastUploadLabel,
  hasUnexportedChanges = false,
  onFileChange,
  isOpen,
  setIsOpen,
}: SpreadsheetUploadCardProps) {
  const hintId = useId();
  const statusId = useId();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between">
        <div className="flex w-full flex-row flex-wrap items-center justify-between gap-3">
          <h2
            id="upload-heading"
            className="font-semibold leading-none tracking-tight"
          >
            Carregar Planilha
          </h2>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            {hasUnexportedChanges ? (
              <div
                role="status"
                aria-live="polite"
                className="inline-flex items-center gap-2 rounded-full border border-warning bg-warning-light px-4 py-2 text-sm font-semibold text-warning"
              >
                <TriangleAlert className="size-5 shrink-0" aria-hidden="true" />
                <span>Planilha não exportada</span>
              </div>
            ) : null}

            <ExportButton />

            <UploadButton
              isParsing={isParsing}
              describedBy={`${hintId} ${statusId}`}
              onFileChange={onFileChange}
            />
          </div>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="flex items-center justify-between p-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Selecione a planilha com os dados dos alunos.
          </p>
          <p id={hintId} className="text-sm text-muted-foreground">
            Formatos aceitos: .xlsx, .ods, .csv
          </p>
        </div>
        <div id={statusId} role="status" className="flex flex-col gap-1">
          {selectedFileName ? (
            <p className="text-sm font-medium text-foreground">
              Arquivo selecionado: {selectedFileName}
            </p>
          ) : null}
          {statusMessage ? (
            <FeedbackMessage tone={statusTone} message={statusMessage} />
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
