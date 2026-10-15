import paletteIcon from "@/assets/icons/art-palette-svgrepo-com.svg";

export function Header() {
  return (
    <header className="flex flex-row items-center justify-start gap-6 bg-brand-header px-28 py-4">
      <div className="bg-primary p-1 rounded-md">
        <img
          src={paletteIcon}
          alt="Paleta de Dados"
          className="h-10 w-10"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Paleta de Dados
        </h1>
        <h2 className="font-dancing text-lg leading-none text-white">
          Escola de Artes Oswaldo Verano
        </h2>
      </div>
    </header>
  );
}
