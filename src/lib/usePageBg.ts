import { useEffect } from "react";

/** Coloca una clave de fondo en #root (páginas o secciones) */
export function usePageBg(key: string) {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const prev = root.getAttribute("data-bg");
    root.setAttribute("data-bg", key);
    return () => {
      if (prev) root.setAttribute("data-bg", prev);
      else root.removeAttribute("data-bg");
    };
  }, [key]);
}
