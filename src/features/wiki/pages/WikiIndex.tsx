// src/features/wiki/pages/WikiIndex.tsx
import NavBar from "../../../components/NavBar";
import { useEffect } from "react";
import Footer from "../../../components/Footer";
import { Link, useSearchParams } from "react-router-dom";

import bosses from "../../../content/wiki/bosses.json";
import dreams from "../../../content/wiki/warrior-dreams.json";
import variants from "../../../content/wiki/variants.json";
import charms from "../../../content/wiki/charms.json";
import items from "../../../content/wiki/items.json";
import wikiBg from "../../../assets/wiki-bg.jpg";

// Carga de imágenes por grupo (solo las que vamos a buscar)
const imgsBosses  = import.meta.glob("../../../assets/bosses/*", { eager: true, as: "url" }) as Record<string,string>;
const imgsCharms  = import.meta.glob("../../../assets/charms/*", { eager: true, as: "url" }) as Record<string,string>;
const imgsItems   = import.meta.glob("../../../assets/items/*",  { eager: true, as: "url" }) as Record<string,string>;

type Item = { slug: string; title: string; summary?: string; difficulty?: number };

// qué grupos incluye la búsqueda
const SEARCH_GROUPS: Array<"bosses"|"charms"|"items"> = ["bosses","charms","items"];

const DATA: Record<string, { label: string; items: Item[]; imgs: Record<string,string>; back: string }> = {
  bosses: { label: "Bosses", items: bosses as Item[], imgs: imgsBosses, back: "/wiki/bosses" },
  charms: { label: "Charms", items: charms as Item[], imgs: imgsCharms, back: "/wiki/charms" },
  items:  { label: "Items",  items: items as Item[],  imgs: imgsItems,  back: "/wiki/items"  },
};

// normaliza texto (ignora acentos/mayúsculas)
function norm(s = "") {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

// imagen por grupo/slug (busca .jpg/.png/.webp)
function getImageUrl(imgMap: Record<string,string>, slug: string) {
  const e = Object.entries(imgMap).find(([p]) =>
    p.endsWith(`/${slug}.jpg`) || p.endsWith(`/${slug}.png`) || p.endsWith(`/${slug}.webp`)
  );
  return e?.[1] ?? "";
}

// Tarjeta reutilizable (misma estética de la galería)
function ResultCard({ group, item }: { group: keyof typeof DATA; item: Item }) {
  const imgUrl = getImageUrl(DATA[group].imgs, item.slug);
  return (
    <li className="gallery-card">
      <Link to={`/wiki/${group}/${item.slug}`} className="gallery-link">
        <figure
          className="gallery-figure"
          style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : undefined }}
        >
          {!imgUrl && <div className="gallery-fallback">No image</div>}
          <figcaption className="gallery-caption">{item.title}</figcaption>
        </figure>
        {/* Muestra estrellas SOLO en bosses si quieres */}
        {group === "bosses" && typeof item.difficulty === "number" && (
          <div className="gallery-meta">
            <span className="gallery-stars">
              {"★".repeat(item.difficulty)}{"☆".repeat(5 - item.difficulty)}
            </span>
          </div>
        )}
      </Link>
    </li>
  );
}

export default function WikiIndex() {
  const [sp] = useSearchParams();
  const q = (sp.get("search") ?? "").trim();

  // === BUSCADOR ===
  const results = (() => {
    if (!q) return [];
    const nq = norm(q);
    const out: Array<{ group: keyof typeof DATA; item: Item }> = [];
    for (const g of SEARCH_GROUPS) {
      const block = DATA[g];
      for (const it of block.items) {
        const hay = norm(it.title).includes(nq) || norm(it.summary ?? "").includes(nq) || norm(it.slug).includes(nq);
        if (hay) out.push({ group: g, item: it });
      }
    }
    return out;
  })();

  const hasQuery = q.length > 0;

  // Solo establece el fondo global leyendo wikiBg, sin tocar el JSX ni estilos existentes
  useEffect(() => {
    const el = document.getElementById("root") || document.documentElement;
    const prev = el.style.getPropertyValue("--page-bg");
    el.style.setProperty("--page-bg", `url(${wikiBg})`);
    return () => {
      if (prev) el.style.setProperty("--page-bg", prev);
      else el.style.removeProperty("--page-bg");
    };
  }, []);

  return (
    <>
      <NavBar />
      <main className="container page-wiki">

        {/* === BLOQUE DE RESULTADOS === */}
        {hasQuery && (
          <>
            <h1 className="wiki-group-title">SEARCH</h1>
            <p className="wiki-group-sub">Results for “{q}” — {results.length} {results.length === 1 ? "match" : "matches"}</p>

            {results.length === 0 ? (
              <p style={{ marginTop: 8, color: "var(--text-subtle)" }}>
                No results in Bosses, Charms or Items.
              </p>
            ) : (
              <ul className="gallery-grid" style={{ marginBottom: 20 }}>
                {results.map((r) => (
                  <ResultCard key={`${r.group}:${r.item.slug}`} group={r.group} item={r.item} />
                ))}
              </ul>
            )}

            {/* separador visual antes del índice normal */}
            <hr className="section-divider" />
          </>
        )}

        {/* ====== COMBAT ====== */}
        <h1 className="wiki-group-title">COMBAT</h1>
        <p className="wiki-group-sub">
          Choose a section to browse. Each section opens an image gallery where every card
          links to a detailed page.
        </p>

        <section className="wiki-sections">
          <article className="wiki-section-card">
            <div className="wiki-section-head">
              <h3 className="wiki-section-title">Bosses</h3>
              <span className="wiki-section-count">{bosses.length} items</span>
            </div>
            <p className="wiki-section-desc">Main encounters across Hallownest.</p>
            <Link to="/wiki/bosses" className="btn secondary">Open Bosses</Link>
          </article>

          <article className="wiki-section-card">
            <div className="wiki-section-head">
              <h3 className="wiki-section-title">Warrior Dreams</h3>
              <span className="wiki-section-count">{(dreams as any[]).length} items</span>
            </div>
            <p className="wiki-section-desc">Fallen warriors fought in the Dream Realm.</p>
            <Link to="/wiki/warrior-dreams" className="btn secondary">Open Warrior Dreams</Link>
          </article>

          <article className="wiki-section-card">
            <div className="wiki-section-head">
              <h3 className="wiki-section-title">Boss Variants</h3>
              <span className="wiki-section-count">{(variants as any[]).length} items</span>
            </div>
            <p className="wiki-section-desc">Alternate, harder or story-related versions.</p>
            <Link to="/wiki/variants" className="btn secondary">Open Boss Variants</Link>
          </article>
        </section>

        {/* ====== COLLECTIBLES ====== */}
        <h2 className="wiki-group-title" style={{ marginTop: 28 }}>COLLECTIBLES</h2>
        <p className="wiki-group-sub">
          Discover useful upgrades and items you can find throughout the world.
        </p>

        <section className="wiki-sections">
          <article className="wiki-section-card">
            <div className="wiki-section-head">
              <h3 className="wiki-section-title">Charms</h3>
              <span className="wiki-section-count">{(charms as any[]).length} items</span>
            </div>
            <p className="wiki-section-desc">Equipable modifiers that change your playstyle.</p>
            <Link to="/wiki/charms" className="btn secondary">Open Charms</Link>
          </article>

          <article className="wiki-section-card">
            <div className="wiki-section-head">
              <h3 className="wiki-section-title">Items</h3>
              <span className="wiki-section-count">{(items as any[]).length} items</span>
            </div>
            <p className="wiki-section-desc">Key things you can obtain: maps, upgrades, quest items…</p>
            <Link to="/wiki/items" className="btn secondary">Open Items</Link>
          </article>
        </section>

      </main>
      <Footer />
    </>
  );
}
