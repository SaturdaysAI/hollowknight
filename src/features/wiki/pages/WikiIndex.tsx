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

// Carga de imágenes por grupo (solo las necesarias para las tarjetas)
const imgsBosses   = import.meta.glob("../../../assets/bosses/*", { eager: true, as: "url" }) as Record<string,string>;
const imgsCharms   = import.meta.glob("../../../assets/charms/*", { eager: true, as: "url" }) as Record<string,string>;
const imgsItems    = import.meta.glob("../../../assets/items/*",  { eager: true, as: "url" }) as Record<string,string>;
const imgsVariants = import.meta.glob("../../../assets/variants/*",  { eager: true, as: "url" }) as Record<string,string>;
const imgsDreams   = import.meta.glob("../../../assets/warrior-dreams/*",  { eager: true, as: "url" }) as Record<string,string>;
const imgsZones    = import.meta.glob("../../../assets/areas/*",  { eager: true, as: "url" }) as Record<string,string>;

type Item = { slug: string; title: string; summary?: string; difficulty?: number };

// Grupos incluidos en la búsqueda
const SEARCH_GROUPS: Array<"bosses"|"charms"|"items"|"variants"|"warrior-dreams"|"zones"> = [
  "bosses","charms","items","variants","warrior-dreams","zones"
];

// Zonas del mapa (solo slug/title para búsqueda)
const zones: Item[] = [
  { slug: "howling-cliffs", title: "Howling Cliffs" },
  { slug: "dirtmouth", title: "Dirtmouth" },
  { slug: "crystal-peak", title: "Crystal Peak" },
  { slug: "greenpath", title: "Greenpath" },
  { slug: "forgotten-crossroads", title: "Forgotten Crossroads" },
  { slug: "resting-grounds", title: "Resting Grounds" },
  { slug: "queens-gardens", title: "Queen's Gardens" },
  { slug: "fog-canyon", title: "Fog Canyon" },
  { slug: "fungal-wastes", title: "Fungal Wastes" },
  { slug: "city-of-tears", title: "City of Tears" },
  { slug: "kingdoms-edge", title: "Kingdom's Edge" },
  { slug: "deepnest", title: "Deepnest" },
  { slug: "royal-waterways", title: "Royal Waterways" },
  { slug: "the-hive", title: "The Hive" },
  { slug: "ancient-basin", title: "Ancient Basin" },
];

const DATA: Record<string, { label: string; items: Item[]; imgs: Record<string,string>; back: string }> = {
  bosses: { label: "Bosses", items: bosses as Item[], imgs: imgsBosses, back: "/wiki/bosses" },
  charms: { label: "Charms", items: charms as Item[], imgs: imgsCharms, back: "/wiki/charms" },
  items:  { label: "Items",  items: items as Item[],  imgs: imgsItems,  back: "/wiki/items"  },
  variants: { label: "Boss Variants", items: variants as Item[], imgs: imgsVariants, back: "/wiki/variants" },
  "warrior-dreams": { label: "Warrior Dreams", items: dreams as Item[], imgs: imgsDreams, back: "/wiki/warrior-dreams" },
  zones: { label: "World Map", items: zones, imgs: imgsZones, back: "/wiki/map" },
};

// normaliza texto (ignora acentos/mayúsculas)
function norm(s = "") {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

// devuelve url de imagen por slug (acepta .jpg/.png/.webp)
function getImageUrl(imgMap: Record<string,string>, slug: string) {
  const e = Object.entries(imgMap).find(([p]) =>
    p.endsWith(`/${slug}.webp`) ||
    p.endsWith(`/${slug}.jpg`)  ||
    p.endsWith(`/${slug}.png`)  ||
    p.endsWith(`/${slug}.svg`)
  );
  return e?.[1] ?? "";
}

// Tarjeta de resultado reutilizable
function ResultCard({ group, item }: { group: keyof typeof DATA; item: Item }) {
  const imgUrl = getImageUrl(DATA[group].imgs, item.slug);
  const href = group === 'zones' ? `/wiki/map?center=${encodeURIComponent(item.slug)}` : `/wiki/${group}/${item.slug}`;
  return (
    <li className="gallery-card">
      <Link to={href} className="gallery-link">
        <figure
          className="gallery-figure"
          style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : undefined }}
        >
          {!imgUrl && <div className="gallery-fallback">No image</div>}
          <figcaption className="gallery-caption">{item.title}</figcaption>
        </figure>
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

  // ==== BUSCADOR ====
  const results = (() => {
    if (!q) return [];
    const nq = norm(q);
    const out: Array<{ group: keyof typeof DATA; item: Item }> = [];
    for (const g of SEARCH_GROUPS) {
      const block = DATA[g];
      for (const it of block.items) {
        const hay =
          norm(it.title).includes(nq) ||
          norm(it.summary ?? "").includes(nq) ||
          norm(it.slug).includes(nq);
        if (hay) out.push({ group: g, item: it });
      }
    }
    return out;
  })();

  const hasQuery = q.length > 0;

  // Fondo de la página (respeta tu sistema de variables)
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
        {/* ==== RESULTADOS DE BÚSQUEDA ==== */}
        {hasQuery && (
          <>
            <h1 className="wiki-group-title">SEARCH</h1>
            <p className="wiki-group-sub">
              Results for “{q}” — {results.length} {results.length === 1 ? "match" : "matches"}
            </p>

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
            <hr className="section-divider" />
          </>
        )}

        {/* ====== COMBAT ====== */}
        <h1 className="wiki-group-title">COMBAT</h1>
        <p className="wiki-group-sub">
          Choose a section to browse. Each section opens an image gallery where every card links to a detailed page.
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

        {/* ====== WORLD / INTERACTIVE MAP ====== */}
        <h2 className="wiki-group-title" style={{ marginTop: 28 }}>WORLD</h2>
        <p className="wiki-group-sub">
          Explore Hallownest with an interactive map. Pan, zoom and locate areas, bosses and more.
        </p>

        <section className="wiki-sections">
          <article className="wiki-section-card">
            <div className="wiki-section-head">
              <h3 className="wiki-section-title">Interactive Map</h3>
              <span className="wiki-section-count">1 tool</span>
            </div>
            <p className="wiki-section-desc">Navigate the world with markers and filters.</p>
            <Link to="/wiki/map" className="btn secondary">Open Map</Link>
          </article>
        </section>

      </main>
      <Footer />
    </>
  );
}
