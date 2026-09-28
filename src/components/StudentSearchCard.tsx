import { Search } from "lucide-react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface StudentSearchCardProps {
  hasSpreadsheetData: boolean | null;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch?: (term: string) => void;
}

export function StudentSearchCard({
  hasSpreadsheetData,
  searchTerm,
  onSearchTermChange,
  onSearch,
}: StudentSearchCardProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch?.(searchTerm);
  }

  return (
    <Card className="p-2">
      <CardHeader>
        <CardTitle asChild>
          <h2 id="busca-heading">Buscar aluno</h2>
        </CardTitle>
        <CardDescription>
          Digite parte do nome para localizar o aluno na planilha carregada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            id="student-search"
            placeholder={
              hasSpreadsheetData
                ? "Digite o nome do aluno"
                : "Carregue a planilha primeiro"
            }
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            disabled={!hasSpreadsheetData}
          />
          <Button
            type="submit"
            disabled={!hasSpreadsheetData || searchTerm.trim() === ""}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            <Search aria-hidden="true" />
            Buscar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
