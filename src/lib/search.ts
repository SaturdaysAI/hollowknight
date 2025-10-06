// src/lib/search.ts

export type WikiItem = {
  slug: string;
  title: string;
  summary?: string;
  tags?: string[];
};

export type WikiSection = {
  id: string;
  title: string;
  items: WikiItem[];
};

export type WikiData = {
  sections: WikiSection[];
};

/** Normaliza texto a minúsculas y sin tildes (para búsqueda simple) */
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

/** Búsqueda muy básica sobre título, resumen y tags */
export function searchWiki(data: WikiData, q: string) {
  const term = norm(q.trim());
  if (!term) return [];
  const out: Array<WikiItem & { sectionId: string; sectionTitle: string }> = [];
  for (const sec of data.sections) {
    for (const it of sec.items) {
      const hay = `${it.title} ${it.summary ?? ""} ${(it.tags ?? []).join(" ")}`;
      if (norm(hay).includes(term)) {
        out.push({ ...it, sectionId: sec.id, sectionTitle: sec.title });
      }
    }
  }
  return out;
}

/** Devuelve una sección por id o null */
export function getSection(data: WikiData, id: string) {
  return data.sections.find((s) => s.id === id) ?? null;
}

/** Devuelve un item por sección+slug o null */
export function getItem(data: WikiData, sectionId: string, slug: string) {
  const sec = getSection(data, sectionId);
  if (!sec) return null;
  return sec.items.find((i) => i.slug === slug) ?? null;
}
