import { ChevronDown, ExternalLink, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import type { StudentRecordType } from "@/types/studentRecordType";

interface StudentDocumentItem {
  label: string;
  url: string;
}

interface StudentDocumentsSectionProps {
  student: StudentRecordType;
}

function DocumentLinkItem({ label, url }: StudentDocumentItem) {
  if (!url) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        disabled
      >
        {label}
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" className="w-full justify-start">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <span className="flex-1 text-left">{label}</span>
        <ExternalLink aria-hidden="true" className="text-muted-foreground" />
      </a>
    </Button>
  );
}

export function StudentDocumentsSection({
  student,
}: StudentDocumentsSectionProps) {
  const documents: StudentDocumentItem[] = [
    { label: "Visualizar foto", url: student.foto_3x4?.trim() ?? "" },
    { label: "Visualizar laudo", url: student.laudo_medico?.trim() ?? "" },
  ];

  const availableCount = documents.filter(({ url }) => url).length;

  return (
    <Collapsible className="mt-5 border-t border-border pt-4">
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="group w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Paperclip aria-hidden="true" />
            Documentos ({availableCount})
          </span>
          <ChevronDown
            aria-hidden="true"
            className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {documents.map((document, index) => (
          <div key={document.label} className="space-y-2">
            {index > 0 ? <Separator /> : null}
            <DocumentLinkItem {...document} />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
