import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import { z } from "zod";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const searchSchema = z.object({
  searchTerm: z
    .string()
    .trim()
    .min(2, "Digite pelo menos 2 caracteres.")
    .regex(/^[\p{L} ]+$/u, "Use apenas letras e espaços.")
    .refine((value) => !/ {2,}/.test(value), "Não use espaços seguidos."),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface StudentSearchCardProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  statusMessage: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function StudentSearchArea({ setSearchTerm, statusMessage, setIsOpen }: StudentSearchCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    mode: "onSubmit"
  });

  const search: SubmitHandler<SearchFormValues> = (data: SearchFormValues) => {
    setSearchTerm(data.searchTerm);
    setIsOpen(false);
  };

  const errorId = "student-search-error";

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <h2
          id="busca-heading"
          className="font-semibold leading-none tracking-tight"
        >
          Buscar aluno
        </h2>
        <p className="text-sm text-muted-foreground">
          Digite o nome para localizar o aluno na planilha carregada.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          void handleSubmit(search)(e);
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <Input
              id="student-search"
              placeholder={statusMessage}
              aria-invalid={errors.searchTerm ? true : undefined}
              aria-describedby={errors.searchTerm ? errorId : undefined}
              {...register("searchTerm")}
            />
            {errors.searchTerm ? (
              <p id={errorId} role="alert" className="text-sm text-destructive">
                {errors.searchTerm.message}
              </p>
            ) : null}
          </div>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            <Search aria-hidden="true" />
            Buscar
          </Button>
        </div>
      </form>
    </div>
  );
}
