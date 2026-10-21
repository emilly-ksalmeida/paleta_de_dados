import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ChevronsUpDown,
  CircleAlert,
  CircleCheck,
  Download,
  Loader2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { exportStudentsToXlsx } from "@/lib/spreadsheet/exportSpreadsheet";
import { db } from "@/lib/storage/db";
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

const EXPORT_FEEDBACK_DURATION_MS = 10000;
const EXPORT_FEEDBACK_EXIT_MS = 250;

interface ExportStatus {
  tone: StatusTone;
  message: string;
}

export function SpreadsheetUploadCard({
  selectedFileName = null,
  isParsing = false,
  statusMessage,
  statusTone = "default",
  lastUploadLabel,
  onFileChange,
  isOpen,
  setIsOpen,
}: SpreadsheetUploadCardProps) {
  const inputId = useId();
  const hintId = useId();
  const statusId = useId();

  // estado do export, independente do status do upload
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<ExportStatus | null>(null);
  const [isExportFeedbackExiting, setIsExportFeedbackExiting] = useState(false);

  // timers que controlam o sumiço do feedback de exportação
  const hideExportFeedbackTimer = useRef<number | null>(null);
  const removeExportFeedbackTimer = useRef<number | null>(null);

  // quantidade de alunos armazenados no navegador
  const studentCount = useLiveQuery(() => db.students.count(), []);

  function clearExportFeedbackTimers() {
    if (hideExportFeedbackTimer.current !== null) {
      window.clearTimeout(hideExportFeedbackTimer.current);
    }
    if (removeExportFeedbackTimer.current !== null) {
      window.clearTimeout(removeExportFeedbackTimer.current);
    }
    hideExportFeedbackTimer.current = null;
    removeExportFeedbackTimer.current = null;
  }

  function showExportStatus(status: ExportStatus) {
    clearExportFeedbackTimers();
    setExportStatus(status);
    setIsExportFeedbackExiting(false);

    hideExportFeedbackTimer.current = window.setTimeout(() => {
      setIsExportFeedbackExiting(true);

      removeExportFeedbackTimer.current = window.setTimeout(() => {
        setExportStatus(null);
        setIsExportFeedbackExiting(false);
      }, EXPORT_FEEDBACK_EXIT_MS);
    }, EXPORT_FEEDBACK_DURATION_MS);
  }

  useEffect(() => {
    return () => {
      clearExportFeedbackTimers();
    };
  }, []);

  async function handleExport() {
    clearExportFeedbackTimers();
    setIsExporting(true);
    setExportStatus(null);
    setIsExportFeedbackExiting(false);

    try {
      const result = await exportStudentsToXlsx();

      showExportStatus(
        result.success
          ? { tone: "success", message: result.message }
          : { tone: "error", message: result.message },
      );
    } catch {
      showExportStatus({
        tone: "error",
        message: "Não foi possível exportar a planilha.",
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between">
        <div className="flex w-full flex-row items-center justify-between">
          <h2
            id="upload-heading"
            className="font-semibold leading-none tracking-tight"
          >
            Carregar Planilha
          </h2>
          <div className="flex items-center gap-10">
            <Input
              id={inputId}
              type="file"
              accept=".xlsx,.ods,.csv"
              className="sr-only"
              disabled={isParsing}
              aria-describedby={`${hintId} ${statusId}`}
              onChange={onFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleExport()}
              disabled={isExporting || !studentCount}
              title={
                studentCount
                  ? "Baixar os dados carregados em uma planilha"
                  : "Não há dados no navegador para exportar"
              }
            >
              {isExporting ? (
                <span
                  key="exporting"
                  className="flex items-center gap-2 motion-safe:animate-feedback-in"
                >
                  <Loader2 className="animate-spin" aria-hidden="true" />
                  Exportando...
                </span>
              ) : exportStatus?.tone === "success" ? (
                <span
                  key="success"
                  className="flex items-center gap-2 motion-safe:animate-feedback-in"
                >
                  <CircleCheck className="text-success" aria-hidden="true" />
                  Exportar planilha
                </span>
              ) : exportStatus?.tone === "error" ? (
                <span
                  key="error"
                  className="flex items-center gap-2 motion-safe:animate-feedback-in"
                >
                  <CircleAlert
                    className="text-destructive"
                    aria-hidden="true"
                  />
                  Exportar planilha
                </span>
              ) : (
                <span
                  key="idle"
                  className="flex items-center gap-2 motion-safe:animate-feedback-in"
                >
                  <Download aria-hidden="true" />
                  Exportar planilha
                </span>
              )}
            </Button>
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
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      {exportStatus ? (
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "mt-2 max-w-sm rounded-md border px-3 py-2 text-sm",
            statusToneStyles[exportStatus.tone],
            isExportFeedbackExiting
              ? "motion-safe:animate-feedback-out"
              : "motion-safe:animate-feedback-in",
          )}
        >
          {exportStatus.message}
        </p>
      ) : null}

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
