import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { CircleAlert, CircleCheck, Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportStudentsToXlsx } from "@/lib/spreadsheet/exportSpreadsheet";
import { db } from "@/lib/storage/db";
import type { StatusTone } from "@/types/component.types";
import FeedbackMessage from "./FeedbackMessage";

const EXPORT_FEEDBACK_DURATION_MS = 10000;
const EXPORT_FEEDBACK_EXIT_MS = 250;

interface ExportStatus {
  tone: StatusTone;
  message: string;
}

export default function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<ExportStatus | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const hideTimer = useRef<number | null>(null);
  const removeTimer = useRef<number | null>(null);

  const studentCount = useLiveQuery(() => db.students.count(), []);

  function clearTimers() {
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    if (removeTimer.current !== null) window.clearTimeout(removeTimer.current);
    hideTimer.current = null;
    removeTimer.current = null;
  }

  function showStatus(status: ExportStatus) {
    clearTimers();
    setExportStatus(status);
    setIsExiting(false);

    hideTimer.current = window.setTimeout(() => {
      setIsExiting(true);
      removeTimer.current = window.setTimeout(() => {
        setExportStatus(null);
        setIsExiting(false);
      }, EXPORT_FEEDBACK_EXIT_MS);
    }, EXPORT_FEEDBACK_DURATION_MS);
  }

  useEffect(() => clearTimers, []);

  async function handleExport() {
    clearTimers();
    setIsExporting(true);
    setExportStatus(null);
    setIsExiting(false);

    try {
      const result = await exportStudentsToXlsx();
      showStatus({
        tone: result.success ? "success" : "error",
        message: result.message,
      });
    } catch {
      showStatus({
        tone: "error",
        message: "Não foi possível exportar a planilha.",
      });
    } finally {
      setIsExporting(false);
    }
  }

  // qual "visual" o botão deve mostrar agora
  const view = isExporting ? "exporting" : (exportStatus?.tone ?? "idle");

  const icon = {
    exporting: <Loader2 className="animate-spin" aria-hidden="true" />,
    success: <CircleCheck className="text-success" aria-hidden="true" />,
    error: <CircleAlert className="text-destructive" aria-hidden="true" />,
    idle: <Download aria-hidden="true" />,
  }[view as "exporting" | "success" | "error" | "idle"];

  return (
    <div className="relative">
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
        <span
          key={view}
          className="flex items-center gap-2 motion-safe:animate-feedback-in"
        >
          {icon}
          {isExporting ? "Exportando..." : "Exportar planilha"}
        </span>
      </Button>

      {exportStatus ? (
        <FeedbackMessage
          tone={exportStatus.tone}
          message={exportStatus.message}
          role="status"
          aria-live="polite"
          className={cn(
            "absolute right-0 top-full z-10 mt-2 w-max",
            isExiting
              ? "motion-safe:animate-feedback-out"
              : "motion-safe:animate-feedback-in",
          )}
        />
      ) : null}
    </div>
  );
}
