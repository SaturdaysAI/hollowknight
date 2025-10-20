// ItemsPage.tsx
import NavBar from "../../../components/NavBar";
import { useEffect } from "react";
import Footer from "../../../components/Footer";
import { Link } from "react-router-dom";
import items from "../../../content/wiki/items.json";
import fondo5 from "../../../assets/fondo5.jpg";

const imgs = import.meta.glob("../../../assets/items/*", { eager: true, as: "url" }) as Record<string,string>;

type Item = { slug:string; title:string; img?:string; summary?:string; group?:string };

export default function ItemsPage() {
  useEffect(() => {
    const el = document.getElementById("root") || document.documentElement;
    const prev = el.style.getPropertyValue("--page-bg");
    el.style.setProperty("--page-bg", `url(${fondo5})`);
    return () => {
      if (prev) el.style.setProperty("--page-bg", prev);
      else el.style.removeProperty("--page-bg");
    };
  }, []);

  const entries = Object.entries(imgs);
  const resolveImg = (it: Item) => {
    if (it.img) {
      const hit = entries.find(([p]) => p.endsWith(`/${it.img!}`));
      if (hit) return hit[1];
    }
    const hit = entries.find(([p]) => p.endsWith(`/${it.slug}.jpg`) || p.endsWith(`/${it.slug}.png`) || p.endsWith(`/${it.slug}.webp`));
    return hit?.[1] ?? "";
  };

  const data = items as Item[];
  const GROUPS: Record<string,{label:string; icon: JSX.Element}> = {
    keys: { label: "Keys", icon: (
      <svg viewBox="0 0 24 24" width={16} height={16} className="cat-icon" aria-hidden>
        <path d="M15 7a4 4 0 1 0-3.6 3.98L8 14v2h2v2h2l1.4-1.4M11 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
    exploration: { label: "Exploration", icon: (
      <svg viewBox="0 0 24 24" width={16} height={16} className="cat-icon" aria-hidden>
        <path d="M3 7l8-4 10 5-8 4-10-5Zm8 4v10m0-10 8-4M11 21l8-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
    quests: { label: "Quests", icon: (
      <svg viewBox="0 0 24 24" width={16} height={16} className="cat-icon" aria-hidden>
        <path d="M4 5h16v14H4z M8 7h8v2H8zm0 4h8v2H8z" fill="none" stroke="currentColor" strokeWidth={1.6} />
      </svg>
    )},
    upgrades: { label: "Upgrades", icon: (
      <svg viewBox="0 0 24 24" width={16} height={16} className="cat-icon" aria-hidden>
        <path d="M12 3v6m0 0 3-3m-3 3-3-3M4 14h16m-10 7h4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
    tradables: { label: "Collectibles", icon: (
      <svg viewBox="0 0 24 24" width={16} height={16} className="cat-icon" aria-hidden>
        <path d="M12 2 15 8l6 .5-4.6 3.6 1.6 6L12 15l-6 3.1 1.6-6L3 8.5 9 8l3-6Z" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  };

  return (
    <>
      <NavBar />
      <main className="container">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Items</h2>
          <Link to="/wiki" className="btn" style={{ padding: "6px 10px", fontSize: 14 }}>BACK TO WIKI</Link>
        </div>

        <ul className="gallery-grid" aria-label={`Items gallery`}>
          {data.map((it) => {
            const imgUrl = resolveImg(it);
            const href = `/wiki/items/${it.slug}`;
            const raw = (it.group || "").toLowerCase();
            const QUEST_SLUGS = new Set(["delicate-flower","ruined-flower","hunters-journal","hunters-mark","godtuner"]);
            const g = (raw === 'exploration' && QUEST_SLUGS.has(it.slug)) ? 'quests' : raw;
            const info = GROUPS[g] || { label: g || "", icon: <span /> };
            return (
              <li key={it.slug} className="gallery-card">
                <Link to={href} className="gallery-link">
                  <figure className="gallery-figure" style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : undefined }}>
                    {!imgUrl && <div className="gallery-fallback">{it.title}</div>}
                    <figcaption className="gallery-caption">{it.title}</figcaption>
                  </figure>
                  <div className="gallery-meta">
                    <span className="cat-pill"><span className="cat-ico-wrap">{info.icon}</span><span>{info.label}</span></span>
                  </div>
                  {/* No effect/sell text on cards; see detail page */}
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
      <Footer />
    </>
  );
}
