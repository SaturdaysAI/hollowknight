// src/features/wiki/components/Gallery.tsx
import { Link } from "react-router-dom";

type Item = {
  slug: string;
  title: string;
  img?: string;
  summary?: string;
  difficulty?: number; // bosses (1..5)
  notches?: number;    // charms: muescas
};

type Props = {
  title: string;
  backTo?: { href: string; label: string };
  items: Item[];
  basePath: string;
  assetsGlob: Record<string, string>;
  resolveBy?: "slug" | "filename";
  showStars?: boolean;
};

function Stars({ n = 0 }: { n?: number }) {
  const safe = Math.max(0, Math.min(5, Number.isFinite(n as number) ? (n as number) : 0));
  return (
    <span className="gallery-stars" aria-label={`${safe} out of 5`} title={`${safe} / 5`}>
      {"\u2605".repeat(safe)}
      {"\u2606".repeat(5 - safe)}
    </span>
  );
}

function Notches({ n = 0 }: { n?: number }) {
  const count = Math.max(0, Math.min(10, Number.isFinite(n as number) ? (n as number) : 0));
  return (
    <span className="notches" aria-label={`${count} notches`} title={`${count} notches`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="notch" />
      ))}
      {count === 0 && <span className="notch notch--zero">0</span>}
    </span>
  );
}

export default function Gallery({
  title,
  backTo,
  items,
  basePath,
  assetsGlob,
  resolveBy = "slug",
  showStars = true,
}: Props) {
  const entries = Object.entries(assetsGlob);

  const resolveImg = (it: Item) => {
    if (resolveBy === "filename" && it.img) {
      const hit = entries.find(([p]) => p.endsWith(`/${it.img!}`));
      return hit?.[1] ?? "";
    }
    const hit = entries.find(([p]) =>
      p.endsWith(`/${it.slug}.jpg`) ||
      p.endsWith(`/${it.slug}.png`) ||
      p.endsWith(`/${it.slug}.webp`)
    );
    return hit?.[1] ?? "";
  };

  return (
    <main className="container">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {backTo && (
          <Link to={backTo.href} className="btn" style={{ padding: "6px 10px", fontSize: 14 }}>
            {backTo.label}
          </Link>
        )}
      </div>

      <ul className="gallery-grid" aria-label={`${title} gallery`}>
        {items.map((it) => {
          const imgUrl = resolveImg(it);
          const href = `${basePath}/${it.slug}`;

          const shouldShowStars =
            showStars && typeof it.difficulty === "number" && Number.isFinite(it.difficulty);
          const shouldShowNotches = !showStars && typeof (it as any).notches === "number";

          return (
            <li key={it.slug} className="gallery-card">
              <Link to={href} className="gallery-link">
                <figure
                  className="gallery-figure"
                  style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : undefined }}
                >
                  {!imgUrl && <div className="gallery-fallback">{it.title}</div>}
                  <figcaption className="gallery-caption">{it.title}</figcaption>
                </figure>

                {/* Estrellas (bosses) o muescas (charms) */}
                {shouldShowStars && (
                  <div className="gallery-meta">
                    <Stars n={it.difficulty} />
                  </div>
                )}
                {!shouldShowStars && shouldShowNotches && (
                  <div className="gallery-meta">
                    <Notches n={(it as any).notches} />
                  </div>
                )}
                {/* No extra text on cards — details are shown inside the entry */}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
