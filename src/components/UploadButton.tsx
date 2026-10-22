import { useId, type ChangeEvent } from "react";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadButtonProps {
  isParsing: boolean;
  describedBy: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadButton({
  isParsing,
  describedBy,
  onFileChange,
}: UploadButtonProps) {
  const inputId = useId();

  return (
    <>
      <Input
        id={inputId}
        type="file"
        accept=".xlsx,.ods,.csv"
        className="sr-only"
        disabled={isParsing}
        aria-describedby={describedBy}
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
    </>
  );
}
