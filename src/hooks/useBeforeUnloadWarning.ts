import { useEffect } from "react";
/**
 * Ativa o alerta nativo do navegador ao fechar/recarregar a aba
 * enquanto houver alterações não exportadas.
 */
export function useBeforeUnloadWarning(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent): string => {
      event.preventDefault(); // forma padrão atual
      event.returnValue = ""; // Firefox 6+ / Chrome 119+
      // Fallback legado: necessário no Chrome < 119 (Chrome 109 da instituição).
      // Remover quando o navegador da escola for atualizado.
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled]);
}
